<script lang="ts">
  import type { Todo } from '../types/todos.type'

  interface Properties {
    todo: Todo
    onToggle: (id: number) => void
    onDelete: (id: number) => void
  }

  let { todo, onToggle, onDelete }: Properties = $props()
</script>

<li class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
  <label class="flex items-center gap-3">
    <input
      type="checkbox"
      checked={todo.completed}
      onchange={() => onToggle(todo.id)}
      class="h-4 w-4 rounded border-slate-300"
    />
    <span class="text-sm text-slate-800" class:line-through={todo.completed}>
      {todo.title}
    </span>
  </label>
  <div class="flex items-end gap-2">
    <span class="text-xs tracking-[0.2em] text-slate-400 uppercase">
      {todo.completed ? 'completed' : 'pending'}
    </span>
    <button
      type="button"
      onclick={() => onDelete(todo.id)}
      class="text-xs text-red-500 hover:text-red-700"
      aria-label="Delete todo"
    >
      Delete
    </button>
  </div>
</li>
