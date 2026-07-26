<script lang="ts">
  import type { Todo } from '../types/todos.type'
  import TodoItem from './todo-item.svelte'

  interface Properties {
    todos: Todo[]
    onToggle: (id: number) => void
  }

  let { todos, onToggle }: Properties = $props()
</script>

<ul class="space-y-2">
  {#each todos as todo (todo.id)}
    <TodoItem {todo} {onToggle} />
  {/each}
</ul>
