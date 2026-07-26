<script lang="ts">
  import TodoForm from '$lib/features/todos/components/todo-form.svelte'
  import TodoList from '$lib/features/todos/components/todo-list.svelte'
  import type { Todo } from '$lib/features/todos/types/todos.type'

import type { PageProps as PageProperties } from './$types'

  let { data }: PageProperties = $props()
  let todos = $state<Todo[]>([...data.todos])

  function handleAdd(title: string) {
    todos = [...todos, {
      id: Date.now(),
      title,
      completed: false,
      userId: 1
    }];
  }

  function handleToggle(id: number) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
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

    {#if data.fetchError}
      <p class="text-sm text-red-600">{data.fetchError as string}</p>
    {:else}
      <TodoList {todos} onToggle={handleToggle} />
    {/if}
  </div>
</div>
