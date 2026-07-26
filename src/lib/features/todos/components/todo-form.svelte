<script lang="ts">
  import { validateTodoTitle } from '../validation/todo'

  interface Properties {
    onSubmit: (title: string) => void
  }

  let { onSubmit }: Properties = $props()

  let draftTitle = $state('')
  let error = $state('')

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    const validationError = validateTodoTitle(draftTitle)
    if (validationError) {
      error = validationError
      return
    }
    onSubmit(draftTitle.trim())
    draftTitle = ''
    error = ''
  }
</script>

<form class="mb-6 space-y-3" onsubmit={handleSubmit}>
  <label class="block text-sm font-medium text-slate-700" for="todo-title"> New todo </label>

  <div class="flex flex-col gap-2 sm:flex-row">
    <input
      id="todo-title"
      bind:value={draftTitle}
      class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm ring-0 outline-none focus:border-slate-500"
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
