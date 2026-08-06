<script lang="ts">
  import type { Todo } from '../types/todos.type'
  import TodoItem from './todo-item.svelte'

  interface Properties {
    todos: Todo[]
  }

  let { todos }: Properties = $props()
</script>

<ul class="space-y-2">
  {#each todos as todo (todo.id)}
    <TodoItem {todo} />
  {/each}
</ul>
