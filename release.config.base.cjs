/**
 * Shared semantic-release config for every workspace package in the monorepo.
 * Each workspace re-exports this from its own `release.config.cjs` so
 * multi-semantic-release (which resolves config per package directory) picks it up.
 *
 * Note: `tagFormat` is intentionally not set — multi-semantic-release forces it to
 * `<package-name>@${version}` (e.g. web@x.y.z, mobile@x.y.z, @workspace/ui@x.y.z),
 * overriding any value here.
 *
 * Releases only: GitHub Releases + git tags. No committed CHANGELOG.md, no
 * version-bump commit (no `@semantic-release/git` / `@semantic-release/npm`),
 * so the default `GITHUB_TOKEN` is enough — no push-back to the repo.
 *
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "chore", release: "patch" },
          { type: "build", release: "patch" },
          { type: "ci", release: "patch" },
          { type: "style", release: "patch" },
          { type: "test", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "docs", release: false },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features", hidden: false },
            { type: "fix", section: "Bug Fixes", hidden: false },
            {
              type: "perf",
              section: "Performance Improvements",
              hidden: false,
            },
            { type: "refactor", section: "Code Refactors", hidden: false },
            { type: "chore", section: "Miscellaneous Chores", hidden: false },
            { type: "build", section: "Build System", hidden: false },
            { type: "ci", section: "CI/CD", hidden: false },
            { type: "style", section: "Styles", hidden: false },
            { type: "test", section: "Tests", hidden: false },
            { type: "revert", section: "Reverts", hidden: false },
            { type: "docs", hidden: true },
          ],
        },
      },
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        failTitle: false,
        labels: false,
        releasedLabels: false,
      },
    ],
  ],
};
