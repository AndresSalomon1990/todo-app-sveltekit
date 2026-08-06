<script lang="ts">
  import { enhance } from '$app/forms'

  import { invalidateOnSuccess } from '$lib/shared/forms/invalidate-on-success'
  import type { Todo } from '../types/todos.type'

  interface Properties {
    todo: Todo
  }

  let { todo }: Properties = $props()
</script>

<li
  class="flex items-center justify-between gap-4 border-b border-border py-3.5 last:border-b-0"
>
  <form
    method="POST"
    action="?/toggle"
    use:enhance={invalidateOnSuccess}
    class="flex min-w-0 flex-1 items-center gap-3"
  >
    <input type="hidden" name="id" value={todo.id} />
    <input type="hidden" name="completed" value={String(todo.completed)} />
    <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onchange={(e) => e.currentTarget.form?.requestSubmit()}
        class="h-4 w-4 shrink-0 rounded border-border text-ink focus:ring-ink"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        class="truncate text-sm text-ink transition-colors"
        class:line-through={todo.completed}
        class:text-ink-muted={todo.completed}
      >
        {todo.title}
      </span>
    </label>
  </form>

  <div class="flex shrink-0 items-center gap-3">
    <span
      class="rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium tracking-widest uppercase
        {todo.completed ? 'bg-done-bg text-done-text' : 'bg-pending-bg text-pending-text'}"
    >
      {todo.completed ? 'Done' : 'Pending'}
    </span>

    <form method="POST" action="?/delete" use:enhance={invalidateOnSuccess}>
      <input type="hidden" name="id" value={todo.id} />
      <button
        type="submit"
        class="text-xs text-ink-muted transition-colors hover:text-danger-text"
        aria-label={`Remove "${todo.title}"`}
      >
        Remove
      </button>
    </form>
  </div>
</li>
