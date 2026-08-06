<script lang="ts">
  import type { TodoFilter } from '../types/todo-filter.type'

  interface Properties {
    activeFilter: TodoFilter
    counts: { all: number; active: number; completed: number }
    onFilterChange: (filter: TodoFilter) => void
  }

  let { activeFilter, counts, onFilterChange }: Properties = $props()

  const filters = $derived<{ value: TodoFilter; label: string; count: number }[]>([
    { value: 'all', label: 'All', count: counts.all },
    { value: 'active', label: 'Active', count: counts.active },
    { value: 'completed', label: 'Done', count: counts.completed },
  ])
</script>

<div class="flex gap-1.5" role="group" aria-label="Filter tasks">
  {#each filters as { value, label, count } (value)}
    <button
      type="button"
      class="rounded-full px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors
        {activeFilter === value
        ? 'bg-ink text-surface'
        : 'bg-canvas text-ink-muted hover:bg-border/60'}"
      aria-pressed={activeFilter === value}
      onclick={() => onFilterChange(value)}
    >
      {label}
      <span class="ml-1 font-mono tabular-nums">{count}</span>
    </button>
  {/each}
</div>
