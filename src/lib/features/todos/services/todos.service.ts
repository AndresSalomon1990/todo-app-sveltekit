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

export async function createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error(`Error creating todo: ${response.status}`);
  }

  return (await response.json()) as Todo;
}

export async function updateTodo(id: number, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Error updating todo: ${response.status}`);
  }

  return (await response.json()) as Todo;
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting todo: ${response.status}`);
  }
}
