# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This is a **multi-context** repo (a Turborepo monorepo). Each app/package carries its own
domain context rather than sharing one global `CONTEXT.md`.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points at one `CONTEXT.md` per context (per app/package). Read each one relevant to the topic before exploring.
- The per-context **`CONTEXT.md`** files it references (e.g. `apps/web/CONTEXT.md`, `packages/backend/CONTEXT.md`).
- **`docs/adr/`** at the root for system-wide decisions, plus **`<package>/docs/adr/`** for decisions scoped to a single app or package.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This repo (presence of `CONTEXT-MAP.md` at the root marks it multi-context):

```
/
├── CONTEXT-MAP.md                       ← index of every context's CONTEXT.md
├── docs/adr/                            ← system-wide decisions
├── apps/
│   ├── web/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                    ← web-specific decisions
│   └── mobile/
│       ├── CONTEXT.md
│       └── docs/adr/                    ← mobile-specific decisions
└── packages/
    ├── ui/
    │   ├── CONTEXT.md
    │   └── docs/adr/
    └── backend/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant context's `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
