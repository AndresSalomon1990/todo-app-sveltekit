import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createTodo, getTodos } from '../services/todos.service'
import { validateTodoTitle } from './todo'

describe('todo validation', () => {
  it('accepts a valid title', () => {
    expect(validateTodoTitle('Valid Title')).toBeNull()
  })

  it('rejects an empty title', () => {
    expect(validateTodoTitle('')).toBe("Todo can't be empty")
  })

  it('rejects short titles', () => {
    expect(validateTodoTitle('Hi')).toBe('Todo must be at least 3 characters long')
  })

  it('rejects long titles', () => {
    expect(validateTodoTitle('A'.repeat(81))).toBe("Todo can't be longer than 80 characters")
  })
})

const fakeTodos = [{ userId: 1, id: 1, title: 'Test todo', completed: false }]

describe('getTodos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns todos when the API responds ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => fakeTodos,
    } as Response)

    const todos = await getTodos()
    expect(todos).toEqual(fakeTodos)
  })

  it('throws error when the API response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    await expect(getTodos()).rejects.toThrow('Error fetching todos: 500')
  })
})

it('creates a todo when the API responds ok', async () => {
  const newTodo = { userId: 1, title: 'New', completed: false };
  const created = { id: 101, ...newTodo };

  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => created,
  } as Response);

  const result = await createTodo(newTodo);
  expect(result).toEqual(created);
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/todos'),
    expect.objectContaining({ method: 'POST' })
  );
});
