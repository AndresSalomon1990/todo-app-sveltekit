import type { Todo } from '../types/todos.type'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${BASE_URL}/todos?_limit=10`)

  if (!response.ok) {
    throw new Error(`Error fetching todos: ${response.status}`)
  }

  const data = (await response.json()) as Todo[]
  return data
}
