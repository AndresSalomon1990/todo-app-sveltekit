<script lang="ts">
  import TodoFilterBar from '$lib/features/todos/components/todo-filter.svelte'
  import TodoForm from '$lib/features/todos/components/todo-form.svelte'
  import TodoList from '$lib/features/todos/components/todo-list.svelte'
  import type { TodoFilter } from '$lib/features/todos/types/todo-filter.type'
  import type { Todo } from '$lib/features/todos/types/todos.type'
  import { filterTodos, todoCounts } from '$lib/features/todos/utils/filter-todos'

  import type { PageProps as PageProperties } from './$types'

  let { data, form }: PageProperties = $props()

  let todos = $state<Todo[]>([])

  $effect(() => {
    todos = [...data.todos]
  })

  let activeFilter: TodoFilter = $state<TodoFilter>('all')

  const counts = $derived(todoCounts(todos))

  const visibleTodos = $derived(filterTodos(todos, activeFilter))

  function handleFilterChange(filter: TodoFilter) {
    activeFilter = filter
  }
</script>

<svelte:head>
  <title>Todo App</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <header class="mb-6">
      <p class="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">SvelteKit</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Todo app</h1>
      <p class="mt-2 text-sm text-slate-600">
        Simple todo app built with SvelteKit, TypeScript, and TailwindCSS.
      </p>
    </header>

    <TodoForm actionError={form?.actionError} title={form?.title} />

    <TodoFilterBar {activeFilter} {counts} onFilterChange={handleFilterChange} />

    {#if data.fetchError}
      <p class="text-sm text-red-600">{data.fetchError as string}</p>
    {:else if visibleTodos.length === 0}
      <p class="text-sm text-slate-500">
        {activeFilter === 'all' ? 'No todos yet. Add one above!' : `No ${activeFilter} todos.`}
      </p>
    {:else}
      <TodoList todos={visibleTodos} />
    {/if}
  </div>
</div>
