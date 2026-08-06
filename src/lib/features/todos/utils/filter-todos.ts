import type { TodoFilter } from '../types/todo-filter.type'
import type { Todo } from '../types/todos.type'

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case 'all': {
      return todos
    }
    case 'active': {
      return todos.filter((t) => !t.completed)
    }
    case 'completed': {
      return todos.filter((t) => t.completed)
    }
    default: {
      const exhaustiveCheck: never = filter
      return exhaustiveCheck
    }
  }
}

export function todoCounts(todos: Todo[]) {
  let active = 0
  let completed = 0

  for (const todo of todos) {
    if (todo.completed) {
      completed += 1
    } else {
      active += 1
    }
  }

  return {
    all: todos.length,
    active,
    completed,
  }
}
