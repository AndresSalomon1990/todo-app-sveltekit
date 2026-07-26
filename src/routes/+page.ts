import { getTodos } from '$lib/features/todos/services/todos.service'

import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  try {
    const todos = await getTodos()
    return { todos, fetchError: null }
  } catch (error) {
    return {
      todos: [],
      fetchError: error instanceof Error ? error.message : 'Error al cargar tareas',
    }
  }
}
