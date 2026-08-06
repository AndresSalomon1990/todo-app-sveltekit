# SvelteKit learning guide

Personal reference built while developing this todo app. Covers the concepts, trade-offs, and patterns used — useful when starting a more complex project.

---

## Table of contents

1. [Mental model: how SvelteKit routes work](#mental-model-how-sveltekit-routes-work)
2. [`+page.ts` vs `+page.server.ts`](#pagets-vs-pageserverts)
3. [The `load` function](#the-load-function)
4. [Svelte 5 runes](#svelte-5-runes)
5. [Form actions](#form-actions)
6. [Client-side mutations vs form actions vs hybrid](#client-side-mutations-vs-form-actions-vs-hybrid)
7. [Project architecture](#project-architecture)
8. [Testing strategy](#testing-strategy)
9. [JSONPlaceholder caveats](#jsonplaceholder-caveats)
10. [Decision cheat sheet](#decision-cheat-sheet)

---

## Mental model: how SvelteKit routes work

A route in SvelteKit is a folder under `src/routes/`:

```
src/routes/
├── +layout.svelte      # Wrapper shared by child routes
├── +page.svelte        # UI for this URL
├── +page.ts            # Universal load (optional)
└── +page.server.ts     # Server-only load + actions (optional)
```

**Request flow for a page visit:**

```
Browser requests /
       ↓
SvelteKit runs load() (server and/or universal)
       ↓
Returns { data } to +page.svelte as props
       ↓
Component renders with data
```

**Request flow for a form action:**

```
User submits <form method="POST" action="?/create">
       ↓
SvelteKit runs actions.create() on the server
       ↓
Returns success or fail() → updates `form` prop
       ↓
use:enhance intercepts → no full page reload
       ↓
Optional: invalidateAll() re-runs load()
```

Think of SvelteKit as **Remix-like loaders + actions**, but with Svelte components instead of React.

---

## `+page.ts` vs `+page.server.ts`

You can have **one `load` per route**, in either file — not both.

| | `+page.ts` | `+page.server.ts` |
|---|---|---|
| **Runs on** | Server **and** client (during SPA navigation) | Server only |
| **Can use secrets** | No — code may ship to the browser | Yes — `$env/static/private`, DB credentials |
| **Can use browser APIs** | Only when running in the browser | Never |
| **Best for** | Public APIs, non-sensitive data | DB queries, auth, private keys |
| **Also supports** | `load` only | `load` + `actions` |

### When to use which

```
┌─────────────────────────────────────────────────────────┐
│ Does the code need secrets or direct DB access?         │
├──────────────────────────┬──────────────────────────────┤
│ YES                      │ NO                           │
│ → +page.server.ts        │ → +page.ts is enough           │
└──────────────────────────┴──────────────────────────────┘
```

**This project uses `+page.server.ts`** because form `actions` must live in a server file. We moved `load` there too so data fetching and mutations live together.

### Can you have both files?

Yes, but with clear roles:

- `+page.ts` → universal `load` only
- `+page.server.ts` → `actions` only (no duplicate `load`)

Or just `+page.server.ts` for both `load` and `actions` (what we did).

---

## The `load` function

`load` runs **before** the page renders. It fetches data and returns it to the component.

```ts
// +page.server.ts
export const load: PageServerLoad = async () => {
  const todos = await getTodos()
  return { todos, fetchError: null }
}
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data }: PageProps = $props()
  const todos = $derived(data.todos)
</script>
```

### Why not `onMount` + `fetch`?

| | `onMount` + fetch | `load` |
|---|---|---|
| When data arrives | After first render (loading flash) | Before render |
| Runs on server | No | Yes (SSR) |
| SEO | Poor | Good |
| SvelteKit idiomatic | No | Yes |

**Rule:** use `load` for route data. Reserve `onMount` for client-only setup (charts, focus, third-party libs).

### Error handling in `load`

**Option A — return error as data** (what we use):

```ts
try {
  const todos = await getTodos()
  return { todos, fetchError: null }
} catch (error) {
  return { todos: [], fetchError: error.message }
}
```

**Option B — throw** → SvelteKit shows `+error.svelte`:

```ts
const todos = await getTodos() // throws → error page
```

Use A when you want UI control. Use B for fatal errors.

---

## Svelte 5 runes

Runes replace Svelte 4's implicit reactivity (`let x = 0`, `$:`).

### `$state` — mutable reactive state

```ts
let activeFilter = $state<TodoFilter>('all')
```

Use for values **you change** (form inputs, UI toggles, editable lists).

### `$derived` — computed read-only values

```ts
const visibleTodos = $derived(filterTodos(todos, activeFilter))
const counts = $derived(todoCounts(todos))
```

Use when a value is **calculated from other reactive state**. Recalculates automatically when dependencies change. Like `useMemo` in React, but integrated.

**Do not assign to `$derived` values** unless you understand writable deriveds (advanced).

### `$effect` — side effects (use sparingly)

```ts
$effect(() => {
  console.log('todos changed:', todos.length)
})
```

Runs when dependencies change. **Avoid updating state inside `$effect`** — use `$derived` instead.

```ts
// BAD — anti-pattern
let todos = $state([])
$effect(() => { todos = [...data.todos] })

// GOOD — data is the source of truth
const todos = $derived(data.todos)
```

Valid `$effect` uses: logging, syncing to external libraries (D3, maps), analytics.

### `$props` — component inputs

```ts
let { data, form }: PageProps = $props()
```

Replaces Svelte 4's `export let`. Props are reactive — values that depend on props should use `$derived`:

```ts
let { type } = $props()
const color = $derived(type === 'danger' ? 'red' : 'green')
```

### `untrack` — intentional one-time read

```ts
import { untrack } from 'svelte'

let todos = $state(untrack(() => [...data.todos]))
```

Says: "I know this prop is reactive, but I want a snapshot, not a subscription."

Use when you need **local editable copy** that diverges from server data. With form actions + `invalidateAll()`, prefer `$derived(data.todos)` instead.

### Warning: `state_referenced_locally`

Svelte warns when you use a reactive value (`$props`, `$derived`) in a `const` initializer:

```ts
// Warning: counts only captured once
const filters = [{ label: `All ${counts.all}` }]

// Fix: use $derived
const filters = $derived([{ label: `All ${counts.all}` }])
```

---

## Form actions

Form actions are SvelteKit's native way to handle mutations (create, update, delete).

### Why HTML forms?

HTML `<form>` only supports `GET` and `POST`. There is no native `method="DELETE"`.

```
Browser form (always POST)  →  SvelteKit action  →  Your service (any HTTP verb)
```

The **action name** (`?/create`, `?/toggle`) carries the semantic meaning.

### Anatomy

**Server (`+page.server.ts`):**

```ts
export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData()
    const title = formData.get('title')

    const error = validateTodoTitle(title)
    if (error) return fail(400, { actionError: error, title })

    await createTodo({ title, completed: false, userId: 1 })
    return { success: true }
  },
} satisfies Actions
```

**Client (`todo-form.svelte`):**

```svelte
<form method="POST" action="?/create" use:enhance={invalidateOnSuccess}>
  <input name="title" />
  <button type="submit">Add</button>
</form>
```

### Key concepts

| Concept | Purpose |
|---------|---------|
| `method="POST"` | Required for form actions |
| `action="?/create"` | Targets the `create` action on this route |
| `name="title"` | Becomes `formData.get('title')` in the action |
| `fail(400, { ... })` | Validation error → returned to `form` prop, no crash |
| `form` prop | Result of last action (`null` if no submit yet) |
| `use:enhance` | Submit via fetch, no full page reload |
| `invalidateAll()` | Re-runs all `load` functions to refresh `data` |

### `use:enhance` — not a rune

`use:enhance` is a **Svelte action** (directive), like `bind:` or `onclick`. It intercepts form submit and sends it in the background.

Without `use:enhance`: form works, but with a full page reload (progressive enhancement).
With `use:enhance`: SPA-like behavior, JS required for good UX.

### Mini-forms for toggle/delete

Form actions only fire on **form submit**. For a checkbox or delete button:

```svelte
<form method="POST" action="?/toggle" use:enhance={invalidateOnSuccess}>
  <input type="hidden" name="id" value={todo.id} />
  <input type="hidden" name="completed" value={String(todo.completed)} />
  <input
    type="checkbox"
    checked={todo.completed}
    onchange={(e) => e.currentTarget.form?.requestSubmit()}
  />
</form>
```

`requestSubmit()` programmatically submits the parent form.

---

## Client-side mutations vs form actions vs hybrid

### Option A: Client-side (React-like)

```
User click → handler in component → service.fetch() → update local state
```

| Pros | Cons |
|------|------|
| Simple mental model | JS required |
| Easy optimistic UI | Logic in components |
| Instant feedback | Secrets can't live in client code |
| Good for public APIs | Validation often client-only |

### Option B: Form actions (SvelteKit-native)

```
User submit → form POST → server action → service → invalidateAll()
```

| Pros | Cons |
|------|------|
| Runs on server (secrets safe) | More boilerplate |
| Progressive enhancement | Optimistic UI needs `enhance` callbacks |
| `fail()` for typed errors | Mini-forms for non-form interactions |
| Co-located with route | |

### Option C: Hybrid (common in production)

```
Form action on server (validation, persistence)
  +
enhance callback updates local state (optimistic UI)
```

Use when you want server authority **and** instant UI feedback.

### What we chose in this project

We use **form actions + `invalidateAll()`** as a learning exercise. With JSONPlaceholder (non-persistent API), the UI won't reflect changes correctly — that's expected and documented below.

For a real backend, `invalidateAll()` after mutations is the standard pattern.

---

## Project architecture

### Folder structure

```
src/lib/
├── features/
│   └── todos/
│       ├── components/     # UI specific to todos
│       ├── services/       # API calls (fetch)
│       ├── types/          # TypeScript interfaces
│       ├── validation/     # Pure validation functions
│       └── utils/          # Pure helpers (filter, count)
└── shared/
    └── forms/              # Cross-feature form utilities
```

### Responsibility layers

| Layer | Responsibility | Example |
|-------|---------------|---------|
| `routes/` | Routing, load, actions, page composition | `+page.server.ts` |
| `components/` | UI, props in, events/callbacks out | `todo-form.svelte` |
| `services/` | HTTP communication | `getTodos()`, `createTodo()` |
| `validation/` | Pure input validation | `validateTodoTitle()` |
| `utils/` | Pure data transformations | `filterTodos()` |
| `types/` | Data contracts | `interface Todo` |

### Component communication (Svelte 5)

**Callback props** (preferred over `createEventDispatcher`):

```svelte
<!-- Parent -->
<TodoForm onSubmit={handleAdd} />

<!-- Child -->
<script>
  interface Props { onSubmit: (title: string) => void }
  let { onSubmit }: Props = $props()
</script>
```

Same pattern as React: pass functions as props.

### What goes in `$lib`?

`$lib` is just an import alias (`$lib/...` → `src/lib/...`). Organize internally however you want:

- `features/X/` — domain-specific code
- `shared/` — used by 2+ features

---

## Testing strategy

### What to test

| Layer | How | Why |
|-------|-----|-----|
| Validation | Unit test pure functions | Fast, no DOM needed |
| Services | Unit test with mocked `fetch` | Test HTTP logic in isolation |
| Utils (filter, count) | Unit test with fixture data | Pure functions = easy tests |
| Components | Browser tests (Playwright + vitest) | Only when UI behavior matters |

### What we test in this project

```
validation/todo.spec.ts     → validateTodoTitle()
validation/todo.spec.ts     → getTodos(), createTodo() (mocked fetch)
utils/filter-todos.spec.ts  → filterTodos(), todoCounts()
```

### Pattern for mocking fetch

```ts
import { vi } from 'vitest'

beforeEach(() => vi.stubGlobal('fetch', vi.fn()))
afterEach(() => vi.restoreAllMocks())

vi.mocked(fetch).mockResolvedValue({
  ok: true,
  json: async () => fakeTodos,
} as Response)
```

---

## JSONPlaceholder caveats

JSONPlaceholder is a **fake REST API**:

- `GET` returns real-looking data
- `POST` / `PATCH` / `DELETE` return `200 OK` but **do not persist**
- `POST` always returns `id: 101`
- Re-fetching after create/update/delete returns the **original data**

### Impact on patterns

| Pattern | Works with JSONPlaceholder? |
|---------|----------------------------|
| `load` + display | Yes |
| Client-side optimistic updates | Yes (UI only) |
| Form actions + `invalidateAll()` | No — re-fetch returns stale data |
| Form actions + local state update | Yes (hybrid) |

### For your next project

Replace JSONPlaceholder with:

- A real backend (Supabase, custom API, etc.)
- `+page.server.ts` talking directly to a DB
- Then `invalidateAll()` becomes the correct refresh strategy

---

## Decision cheat sheet

### Data loading

| Scenario | Use |
|----------|-----|
| Route data needed before render | `load` in `+page.ts` or `+page.server.ts` |
| Public API, no secrets | `+page.ts` |
| DB, auth, env secrets | `+page.server.ts` |
| Client-only after mount | `onMount` (rare) |

### State management

| Scenario | Use |
|----------|-----|
| User-editable value | `$state` |
| Computed from other state | `$derived` |
| Props → derived value | `$derived(props.x)` |
| One-time copy of props | `untrack(() => [...props.x])` |
| Side effect (external lib) | `$effect` |
| Server data as source of truth | `$derived(data.x)` |

### Mutations

| Scenario | Use |
|----------|-----|
| Learning SvelteKit patterns | Form actions |
| Public API, SPA feel | Client-side service calls |
| Production with own backend | Form actions + `invalidateAll()` |
| Production, max interactivity | Hybrid (actions + optimistic `enhance`) |
| Headless API route | `+server.ts` (GET/POST/PUT/DELETE) |

### File placement

| What | Where |
|------|-------|
| Page UI | `routes/+page.svelte` |
| Server load + actions | `routes/+page.server.ts` |
| Domain logic | `lib/features/{domain}/` |
| Shared utilities | `lib/shared/` |
| API calls | `lib/features/{domain}/services/` |
| Pure functions | `lib/features/{domain}/utils/` or `validation/` |

---

## Evolution path for your next project

Based on what this app covers, a natural progression:

```
1. Todo app (this project)
   → load, components, services, form actions, runes

2. App with real auth
   → hooks.server.ts, sessions, protected routes, +page.server.ts

3. App with real DB
   → Drizzle/Prisma in server actions, invalidateAll works correctly

4. App with real-time or heavy interactivity
   → Hybrid mutations, maybe +server.ts API routes

5. Larger app
   → More features in lib/features/, shared UI kit, error boundaries, layouts
```

---

## Quick reference: React → SvelteKit

| React / Next | SvelteKit / Svelte 5 |
|--------------|----------------------|
| `useState` | `$state` |
| `useMemo` | `$derived` |
| `useEffect` | `$effect` (sparingly) or `load` |
| `useEffect` on mount | `onMount` or `load` |
| Props | `$props()` |
| `getServerSideProps` | `load` in `+page.server.ts` |
| API routes | `+server.ts` or form `actions` |
| `onSubmit` handler | `<form action="?/name">` + `use:enhance` |
| Context API | Svelte context (`createContext`) |
| `children` prop | `{@render children()}` (Svelte 5) |

---

*Last updated: practice project — todo app with JSONPlaceholder, Svelte 5 runes, form actions.*
