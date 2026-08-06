<script lang="ts">
  import { enhance } from '$app/forms'
  import { invalidateAll } from '$app/navigation'

  interface Properties {
    actionError?: string
    title?: string
  }

  let { actionError, title }: Properties = $props()
</script>

<form
  method="POST"
  action="?/create"
  use:enhance={() => {
    return async ({ result, update }) => {
      await update() // applies server response (update 'form')
      if (result.type === 'success') {
        await invalidateAll() // re-execute 'load' -> 'data.todos' updates
      }
    }
  }}
  class="mb-6 space-y-3"
>
  <label class="block text-sm font-medium text-slate-700" for="todo-title"> New todo </label>

  <div class="flex flex-col gap-2 sm:flex-row">
    <input
      id="todo-title"
      name="title"
      value={title ?? ''}
      class="..."
      placeholder="Enter a new todo"
      type="text"
    />
    <button type="submit" class="...">Add Todo</button>
  </div>

  {#if actionError}
    <p class="text-sm text-red-600" role="alert">{actionError}</p>
  {/if}
</form>
