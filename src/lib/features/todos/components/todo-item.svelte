<script lang="ts">
  import { enhance } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import type { Todo } from '../types/todos.type'

  interface Properties {
    todo: Todo
  }

  let { todo }: Properties = $props()

  const enhanceOptions = () => {
    return async ({
      result,
      update,
    }: {
      result: { type: string }
      update: () => Promise<void>
    }) => {
      await update()
      if (result.type === 'success') {
        await invalidateAll()
      }
    }
  }
</script>

<li class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
  <form
    method="POST"
    action="?/toggle"
    use:enhance={enhanceOptions}
    class="flex items-center gap-3"
  >
    <input type="hidden" name="id" value={todo.id} />
    <input type="hidden" name="completed" value={String(todo.completed)} />
    <label class="flex items-center gap-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onchange={(e) => e.currentTarget.form?.requestSubmit()}
        class="h-4 w-4 rounded border-slate-300"
      />
      <span class="text-sm text-slate-800" class:line-through={todo.completed}>
        {todo.title}
      </span>
    </label>
  </form>

  <div class="flex items-end gap-2">
    <span class="text-xs tracking-[0.2em] text-slate-400 uppercase">
      {todo.completed ? 'completed' : 'pending'}
    </span>
    <form method="POST" action="?/delete" use:enhance={enhanceOptions}>
      <input type="hidden" name="id" value={todo.id} />
      <button
        type="submit"
        class="text-xs text-red-500 hover:text-red-700"
        aria-label="Delete todo"
      >
        Delete
      </button>
    </form>
  </div>
</li>
