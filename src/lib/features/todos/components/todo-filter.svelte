<script lang="ts">
  import type { TodoFilter } from '../types/todo-filter.type'

  interface Properties {
    activeFilter: TodoFilter
    counts: { all: number; active: number; completed: number }
    onFilterChange: (filter: TodoFilter) => void
  }

  let { activeFilter, counts, onFilterChange }: Properties = $props()

  const filters = $derived<{ value: TodoFilter; label: string }[]>([
    { value: 'all', label: `All ${counts.all}` },
    { value: 'active', label: `Active ${counts.active}` },
    { value: 'completed', label: `Completed ${counts.completed}` },
  ]);
</script>

<div class="mb-4 flex gap-2">
  {#each filters as { value, label } (value)}
    <button
      type="button"
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition
        {activeFilter === value
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
      onclick={() => onFilterChange(value)}
    >
      {label}
    </button>
  {/each}
</div>
