# Todo App — SvelteKit practice project

A todo app built to learn SvelteKit and Svelte 5 from scratch. It connects to [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a mock API (no backend required) and walks through routing, data loading, form actions, component architecture, and testing.

The app is intentionally structured as a stepping stone toward more complex projects: feature-based folders, a service layer, pure validation/utils with tests, and patterns you can reuse in production apps.

## What you'll practice here

- **Svelte 5 runes** — `$state`, `$derived`, `$props`
- **SvelteKit routing** — `+page.svelte`, `+page.server.ts`, `load`, `actions`
- **Data fetching** — server-side `load` before render
- **Form actions** — `method="POST"`, `use:enhance`, `fail()`, `invalidateAll()`
- **Architecture** — `src/lib/features/`, services, types, validation, shared utils
- **Testing** — Vitest for pure functions and services
- **UI** — Tailwind CSS v4, editorial minimalist design

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [SvelteKit 2](https://svelte.dev/docs/kit) |
| UI | [Svelte 5](https://svelte.dev/docs/svelte) (runes mode) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + `@tailwindcss/forms` + `@tailwindcss/typography` |
| API | JSONPlaceholder (external REST API) |
| Testing | Vitest |
| Linting / formatting | ESLint + Prettier |
| Deploy adapter | `@sveltejs/adapter-vercel` |
| Build tool | Vite 8 |

## Project structure

```
src/
├── lib/
│   ├── features/
│   │   └── todos/           # Todo domain (components, services, types, validation, utils)
│   └── shared/              # Cross-feature utilities (e.g. form helpers)
└── routes/
    ├── +layout.svelte
    ├── +page.svelte         # Page orchestration
    └── +page.server.ts      # load + form actions
```

## Getting started

```sh
pnpm install
pnpm dev
```

### Other scripts

```sh
pnpm check        # Type-check with svelte-check
pnpm test         # Run unit tests
pnpm lint         # ESLint + Prettier check
pnpm format       # Format with Prettier
pnpm build        # Production build
```

## Learning notes

See [`docs/learning.md`](./docs/learning.md) for a detailed guide on the concepts used in this project: `+page.ts` vs `+page.server.ts`, form actions vs client-side mutations, runes, `$effect` vs `$derived`, and decision tables for your next project.

---

## Agent skills

This project uses [Cursor Agent Skills](https://github.com/vercel-labs/skills) stored in `.agents/skills/`. Skills teach the AI agent project-specific workflows, Svelte best practices, and design direction.

### Restore all skills (recommended for a fresh clone)

If `skills-lock.json` is already in the repo, restore every pinned skill in one command:

```sh
npx skills experimental_install
```

This is the equivalent of `npm ci` for skills — reads `skills-lock.json` and installs into `.agents/skills/`.

### Install skills individually

Use these when bootstrapping a **new** project from scratch:

#### Svelte (used in this project)

```sh
# Svelte 5 runes, reactivity, performance patterns
npx skills add sveltejs/ai-tools --skill svelte-core-bestpractices

# Svelte / SvelteKit code generation guidance
npx skills add sveltejs/ai-tools --skill svelte-code-writer

# Performance debugging for Svelte apps
npx skills add sveltejs/svelte --skill performance-investigation
```

#### Design & UI (used in this project)

```sh
# Distinctive, intentional visual design (typography, layout, copy)
npx skills add anthropics/skills --skill frontend-design

# Warm monochrome editorial UI (Notion-like)
npx skills add Leonxlnx/taste-skill --skill minimalist-ui

# Anti-slop frontend for landing pages and redesigns
npx skills add Leonxlnx/taste-skill --skill design-taste-frontend

# Web Interface Guidelines accessibility / UX audit
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

#### Architecture & review

```sh
# Deepening opportunities, architectural friction reports
npx skills add mattpocock/skills --skill improve-codebase-architecture

# Decision-making / grilling through trade-offs
npx skills add mattpocock/skills --skill grill-me
```

#### Additional design skills (installed, optional)

```sh
npx skills add Leonxlnx/taste-skill --skill brandkit
npx skills add Leonxlnx/taste-skill --skill high-end-visual-design
npx skills add Leonxlnx/taste-skill --skill industrial-brutalist-ui
```

### Skills applied in this project

| Skill | What it contributed |
|-------|---------------------|
| `svelte-core-bestpractices` | Replaced `$effect` state sync with `$derived`, shared `invalidateOnSuccess` helper, single-pass `todoCounts` |
| `minimalist-ui` | Warm monochrome palette, editorial typography, flat borders, pastel status badges |
| `frontend-design` | Copy as design material, semantic HTML landmarks, empty states that invite action |
| `improve-codebase-architecture` | Identified duplicated `enhance` logic → extracted to `lib/shared/` |

### Useful skill commands

```sh
npx skills list              # List installed skills
npx skills check             # Check for upstream updates
npx skills update            # Update installed skills
npx skills remove <name>     # Remove a skill
```

> **Note:** Commit `skills-lock.json` to version control. Add `.agents/skills/` to `.gitignore` if you prefer each developer to restore locally with `npx skills experimental_install`.
