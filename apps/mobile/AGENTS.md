# AGENTS.md — `mobile`

Guidance for the mobile app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: Expo.

## Conventions

- Follow the [Expo v56.0.0 docs](https://docs.expo.dev/versions/v56.0.0/) and invoke the relevant "expo" skill before writing code.
- Styling: Uniwind (Tailwind CSS 4 + CSS theming); invoke the "uniwind" skill first.
- Theme tokens live in `@workspace/ui`'s `theme.css` — don't fork them here.
