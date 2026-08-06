<script lang="ts">
  import TodoFilterBar from '$lib/features/todos/components/todo-filter.svelte'
  import TodoForm from '$lib/features/todos/components/todo-form.svelte'
  import TodoList from '$lib/features/todos/components/todo-list.svelte'
  import type { TodoFilter } from '$lib/features/todos/types/todo-filter.type'
  import { filterTodos, todoCounts } from '$lib/features/todos/utils/filter-todos'

  import type { PageProps as PageProperties } from './$types'

  let { data, form }: PageProperties = $props()

  const todos = $derived(data.todos)

  let activeFilter: TodoFilter = $state('all')

  const counts = $derived(todoCounts(todos))
  const visibleTodos = $derived(filterTodos(todos, activeFilter))

  function handleFilterChange(filter: TodoFilter) {
    activeFilter = filter
  }
</script>

<svelte:head>
  <title>Tasks — SvelteKit practice</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-16">
  <article class="rounded-xl border border-border bg-surface p-8 sm:p-10">
    <header class="mb-10 border-b border-border pb-8">
      <p class="font-mono text-xs tracking-widest text-ink-muted uppercase">SvelteKit · practice</p>
      <h1 class="mt-3 font-serif text-4xl leading-tight font-semibold tracking-tight text-ink">
        Tasks
      </h1>
      <p class="mt-3 max-w-md text-sm text-ink-muted">
        A small list to practice load functions, form actions, and derived state.
      </p>
    </header>

    <section class="mb-8" aria-label="Add a task">
      <TodoForm actionError={form?.actionError} title={form?.title} />
    </section>

    <section class="mb-6" aria-label="Filter tasks">
      <TodoFilterBar {activeFilter} {counts} onFilterChange={handleFilterChange} />
    </section>

    <section aria-label="Task list" aria-live="polite">
      {#if data.fetchError}
        <p class="rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-text" role="alert">
          Could not load tasks. {data.fetchError}
        </p>
      {:else if visibleTodos.length === 0}
        <p class="py-8 text-center text-sm text-ink-muted">
          {#if activeFilter === 'all'}
            No tasks yet. Add one above to get started.
          {:else if activeFilter === 'active'}
            No active tasks. Everything is done, or the list is empty.
          {:else}
            No completed tasks yet. Check one off when you finish it.
          {/if}
        </p>
      {:else}
        <TodoList todos={visibleTodos} />
      {/if}
    </section>
  </article>
</main>
