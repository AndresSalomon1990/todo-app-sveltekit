<script lang="ts">
  import { untrack } from 'svelte'

  import TodoFilterBar from '$lib/features/todos/components/todo-filter.svelte'
  import TodoForm from '$lib/features/todos/components/todo-form.svelte'
  import TodoList from '$lib/features/todos/components/todo-list.svelte'
  import { createTodo, deleteTodo, updateTodo } from '$lib/features/todos/services/todos.service'
  import type { TodoFilter } from '$lib/features/todos/types/todo-filter.type'
  import type { Todo } from '$lib/features/todos/types/todos.type'
  import { filterTodos, todoCounts } from '$lib/features/todos/utils/filter-todos'

  import type { PageProps as PageProperties } from './$types'

  let { data }: PageProperties = $props()
  // we know data is reactive, but we need only a snapshot of the todos array
  let todos = $state<Todo[]>(untrack(() => [...data.todos]))

  let activeFilter: TodoFilter = $state<TodoFilter>('all')

  const counts = $derived(todoCounts(todos))

  const visibleTodos = $derived(filterTodos(todos, activeFilter))

  async function handleAdd(title: string) {
    const optimistic: Todo = {
      id: Date.now(), // temporal
      title,
      completed: false,
      userId: 1,
    }

    todos = [...todos, optimistic]

    try {
      const created = await createTodo({ title, completed: false, userId: 1 })
      // Replace the optimistic with the response from the server
      todos = todos.map((t) => (t.id === optimistic.id ? { ...created, id: optimistic.id } : t))
    } catch {
      // Revert the optimistic
      todos = todos.filter((t) => t.id !== optimistic.id)
      // TODO: show error to the user
    }
  }

  async function handleToggle(id: number) {
    const previous = todos
    todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    try {
      const todo = todos.find((t) => t.id === id)!
      await updateTodo(id, { completed: todo.completed })
    } catch {
      todos = previous // revert
    }
  }

  async function handleDelete(id: number) {
    const previous = todos
    todos = todos.filter((t) => t.id !== id)
    try {
      await deleteTodo(id)
    } catch {
      todos = previous // revert
    }
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

    <TodoForm onSubmit={handleAdd} />

    <TodoFilterBar {activeFilter} {counts} onFilterChange={(f) => (activeFilter = f)} />

    {#if data.fetchError}
      <p class="text-sm text-red-600">{data.fetchError as string}</p>
    {:else if visibleTodos.length === 0}
      <p class="text-sm text-slate-500">
        {activeFilter === 'all' ? 'No todos yet. Add one above!' : `No ${activeFilter} todos.`}
      </p>
    {:else}
      <TodoList todos={visibleTodos} onToggle={handleToggle} onDelete={handleDelete} />
    {/if}
  </div>
</div>
