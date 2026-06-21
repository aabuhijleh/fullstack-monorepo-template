#!/usr/bin/env bash
# setup.sh — Provision a local dev environment for the fullstack monorepo.
#
# Gets you from `git clone` to a working `bun dev` (web in the browser + the
# iOS app in the Simulator) as fast as possible:
#   - verifies the toolchain (bun, node, Xcode, Watchman, CocoaPods, a Simulator)
#   - installs JS deps + git hooks (bun install)
#   - writes local env files from the .env.example templates
#   - provisions Convex (codegen + local deployment) so `bun dev` doesn't block
#   - prebuilds the iOS native project + installs CocoaPods
#
# Idempotent: re-running only does what's missing.
# Non-fatal: if an auto-install isn't possible (Xcode, Homebrew on a fresh Mac),
# it prints instructions and keeps going.
# Fast: independent, non-interactive work runs in parallel.
#
# The first `bun dev` afterwards compiles the iOS app in Xcode (a few minutes);
# every `bun dev` after that is incremental and fast.
#
# Run from anywhere inside the repo:  bash setup.sh   (or: bun run setup)

set -euo pipefail

# ---------- output helpers ----------
log()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m OK\033[0m %s\n' "$*"; }
warn() { printf '\033[1;31m!!\033[0m %s\n' "$*" >&2; }

has()      { command -v "$1" >/dev/null 2>&1; }
is_macos() { [[ "$(uname -s)" == "Darwin" ]]; }

# ---------- parallel job runner ----------
# Background jobs write to per-job log files; logs are replayed in launch order
# after the wave finishes so output stays readable instead of interleaving.
JOB_LOGDIR="$(mktemp -d)"
trap 'rm -rf "$JOB_LOGDIR"' EXIT
_job_pids=()
_job_names=()

# run_bg <name> <fn> [args...] — launch <fn> in the background, capturing output.
run_bg() {
  local name="$1"; shift
  ( "$@" ) >"$JOB_LOGDIR/$name.log" 2>&1 &
  _job_pids+=("$!")
  _job_names+=("$name")
}

# wait_all — wait for every backgrounded job, then replay their logs in order.
wait_all() {
  local i
  for i in "${!_job_pids[@]}"; do
    wait "${_job_pids[$i]}" || true
  done
  for i in "${!_job_names[@]}"; do
    cat "$JOB_LOGDIR/${_job_names[$i]}.log" 2>/dev/null || true
  done
  _job_pids=()
  _job_names=()
}

# ---------- preflight: run from the repo root ----------
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" || ! -d "$repo_root/apps/web" || ! -d "$repo_root/apps/mobile" ]]; then
  warn "run this from inside the fullstack monorepo"
  exit 1
fi
cd "$repo_root"

# ---------- shared helpers ----------
brew_install_if_missing() {
  local cmd="$1" formula="$2"
  if has "$cmd"; then
    ok "$cmd already installed"
  elif has brew; then
    log "Installing $formula (provides $cmd)"
    brew install "$formula"
  else
    warn "brew unavailable — install '$formula' manually to provide '$cmd'"
  fi
}

make_env() {
  local src="$1" dst="$2"
  if [[ -f "$dst" ]]; then
    ok "$dst already exists (leaving untouched)"
  elif [[ -f "$src" ]]; then
    log "Creating $dst from ${src##*/}"
    cp "$src" "$dst"
  else
    warn "$src missing — create $dst manually"
  fi
}

# ---------- toolchain verification ----------

# bun — auto-installable.
step_bun() {
  if has bun; then
    ok "bun already installed ($(bun --version))"
  else
    log "Installing bun"
    curl -fsSL https://bun.sh/install | bash
  fi
}

# node >=24 — required by the workspaces; instruct if missing/old (can't safely
# auto-install over whatever version manager the user has).
check_node() {
  if ! has node; then
    warn "node not found — install Node.js >=24 (https://nodejs.org or 'brew install node'), then re-run"
    return
  fi
  local major; major="$(node -v)"; major="${major#v}"; major="${major%%.*}"
  if [[ "$major" -ge 24 ]]; then
    ok "node $(node -v)"
  else
    warn "node $(node -v) is too old — this repo needs node >=24. Upgrade, then re-run."
  fi
}

# Xcode + command line tools + a Simulator — required for 'expo run:ios'.
check_ios_toolchain() {
  if ! is_macos; then
    warn "non-macOS — the mobile 'dev' script uses 'expo run:ios' (needs a Mac + Xcode)."
    warn "  switch apps/mobile to 'expo run:android' if you intend to develop on Android."
    return
  fi
  if has xcodebuild && xcode-select -p >/dev/null 2>&1; then
    ok "Xcode present ($(xcodebuild -version | head -1))"
  else
    warn "Xcode not fully set up — install it from the App Store, then run:"
    warn "  xcode-select --install && sudo xcodebuild -license accept"
    warn "  'expo run:ios' / 'bun dev' will fail until Xcode + its command line tools are installed."
  fi
  if has xcrun && xcrun simctl list devices >/dev/null 2>&1; then
    ok "iOS Simulator available"
  else
    warn "no iOS Simulator detected — open Xcode once and install a simulator runtime."
  fi
}

# ---------- wave steps ----------
step_env_files() {
  make_env apps/web/.env.example apps/web/.env
  make_env apps/mobile/.env.example apps/mobile/.env
  make_env packages/backend/.env.example packages/backend/.env.local
}

# JS deps + lefthook git hooks (root package.json 'prepare' runs 'lefthook install').
step_js() {
  if ! has bun; then
    warn "bun unavailable — skipping 'bun install'. Install bun, then re-run at the repo root."
    return
  fi
  log "Installing JS dependencies + git hooks (bun install)"
  bun install
}

# Watchman (Metro file watching) + CocoaPods (iOS native deps).
step_brew_rn() {
  brew_install_if_missing watchman watchman
  brew_install_if_missing pod cocoapods
}

# Convex: one sync to provision the local deployment + run codegen, so
# `bun dev` doesn't block on first-time setup. Needs bun deps installed first.
step_convex() {
  if ! has bun; then
    warn "bun unavailable — skipping Convex provisioning. Later: 'cd packages/backend && bunx convex dev --once'"
    return
  fi
  log "Provisioning Convex (codegen + local deployment)"
  (cd packages/backend && bunx convex dev --once) \
    || warn "'convex dev --once' failed — run 'cd packages/backend && bunx convex dev' once interactively, then re-run setup"
}

# iOS: generate the native project (ios/ + android/ are gitignored) and install
# CocoaPods. The Xcode compile itself happens on the first 'expo run:ios'/'bun dev'.
step_prebuild() {
  if ! has bun; then
    warn "bun unavailable — skipping iOS prebuild. Later: 'cd apps/mobile && bunx expo prebuild'"
    return
  fi
  if ! is_macos; then
    warn "non-macOS — skipping iOS prebuild."
    return
  fi
  log "Prebuilding the iOS native project + installing CocoaPods (expo prebuild)"
  (cd apps/mobile && bunx expo prebuild) \
    || warn "'expo prebuild' failed — run 'cd apps/mobile && bunx expo prebuild' manually"
}

# ---------- run ----------

# bun first (everything below needs it). Make it visible for the rest of the run.
step_bun
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
case ":$PATH:" in *":$BUN_INSTALL/bin:"*) ;; *) export PATH="$BUN_INSTALL/bin:$PATH";; esac

# Verify the rest of the toolchain (non-fatal; prints fix instructions).
check_node
check_ios_toolchain

# Wave 1: independent, non-interactive work in parallel — env files, JS deps,
# and the Watchman/CocoaPods Homebrew installs.
log "Wave 1: env files, JS deps, and React Native tooling (parallel)"
run_bg env   step_env_files
run_bg js    step_js
run_bg brew  step_brew_rn
wait_all

# Convex provisioning (needs bun deps from Wave 1).
step_convex

# iOS prebuild + CocoaPods (needs bun deps from Wave 1).
step_prebuild

ok "setup complete"
echo
echo "next: bun dev"
echo "  - web   → http://localhost:3000"
echo "  - mobile → opens in the iOS Simulator (first build compiles in Xcode, ~a few minutes)"
