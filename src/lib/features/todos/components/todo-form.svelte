<script lang="ts">
  import { enhance } from '$app/forms'

  import { invalidateOnSuccess } from '$lib/shared/forms/invalidate-on-success'

  interface Properties {
    actionError?: string
    title?: string
  }

  let { actionError, title }: Properties = $props()
</script>

<form method="POST" action="?/create" use:enhance={invalidateOnSuccess} class="space-y-3">
  <label class="block text-sm font-medium text-ink-muted" for="todo-title">New task</label>

  <div class="flex flex-col gap-2 sm:flex-row">
    <input
      id="todo-title"
      name="title"
      value={title ?? ''}
      class="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-ink"
      placeholder="What needs doing?"
      type="text"
      autocomplete="off"
    />
    <button
      type="submit"
      class="shrink-0 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-ink/85 active:scale-[0.98]"
    >
      Add task
    </button>
  </div>

  {#if actionError}
    <p class="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-text" role="alert">
      {actionError}
    </p>
  {/if}
</form>
