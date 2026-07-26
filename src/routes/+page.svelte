<script lang="ts">
  import type { Todo } from '$lib/types/todo.type';
  import { validateTodoTitle } from '$lib/validation/todo';

  let draftTitle = $state('');
  let error = $state('');
  let todos = $state<Todo[]>([
        {
            id: 1,
            title: 'Learn Svelte',
            completed: false,
            userId: 1
        },
        {
            id: 2,
            title: 'Make a todo app',
            completed: true,
            userId: 1
        }
    ]);

  const addTodo = () => {
    const validateError = validateTodoTitle(draftTitle);

    if (validateError) {
      error = validateError;
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: draftTitle,
      completed: false,
      userId: 1
    };

    todos = [...todos, newTodo];
    draftTitle = '';
    error = '';
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    addTodo();
  }

  function toggleTodo(id: number) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  }
</script>

<svelte:head>
  <title>Todo App</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header class="mb-6">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">SvelteKit</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">Todo app</h1>
            <p class="mt-2 text-sm text-slate-600">
                Simple todo app built with SvelteKit, TypeScript, and TailwindCSS.
            </p>
        </header>

        <form class="mb-6 space-y-3" onsubmit={handleSubmit}>
            <label class="block text-sm font-medium text-slate-700" for="todo-title">
                New todo
            </label>

            <div class="flex flex-col gap-2 sm:flex-row">
                <input
                    id="todo-title"
                    bind:value={draftTitle}
                    class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none ring-0 focus:border-slate-500"
                    placeholder="Enter a new todo"
                    type="text"
                />

                <button
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    type="submit"
                >
                    Add Todo
                </button>
            </div>

            {#if error}
                <p class="text-sm text-red-600">{error}</p>
            {/if}
        </form>

        <ul class="space-y-2">
            {#each todos as todo (todo.id)}
                <li class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <label class="flex items-center gap-3">
                        <input
                            checked={todo.completed}
                            class="h-4 w-4 rounded border-slate-300"
                            onchange={() => toggleTodo(todo.id)}
                            type="checkbox"
                        />

                        <span class:line-through={todo.completed} class="text-sm text-slate-800">
                            {todo.title}
                        </span>
                    </label>

                    <span class="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {todo.completed ? 'completed' : 'pending'}
                    </span>
                </li>
            {/each}
        </ul>
    </div>
</div>
