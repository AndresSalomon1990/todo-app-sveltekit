import { describe, expect, it } from 'vitest'

import type { Todo } from '../types/todos.type'
import { filterTodos, todoCounts } from './filter-todos'

const sampleTodos: Todo[] = [
  { id: 1, title: 'Active one', completed: false, userId: 1 },
  { id: 2, title: 'Done one', completed: true, userId: 1 },
  { id: 3, title: 'Active two', completed: false, userId: 1 },
]

describe('filterTodos', () => {
  it('returns all todos when filter is "all"', () => {
    expect(filterTodos(sampleTodos, 'all')).toHaveLength(3)
  })

  it('returns only incomplete todos when filter is "active"', () => {
    const result = filterTodos(sampleTodos, 'active')
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })

  it('returns only completed todos when filter is "completed"', () => {
    const result = filterTodos(sampleTodos, 'completed')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Done one')
  })
})

describe('todoCounts', () => {
  it('returns correct counts', () => {
    expect(todoCounts(sampleTodos)).toEqual({
      all: 3,
      active: 2,
      completed: 1,
    })
  })

  it('returns zeros for empty array', () => {
    expect(todoCounts([])).toEqual({ all: 0, active: 0, completed: 0 })
  })
})
