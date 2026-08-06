import { fail } from '@sveltejs/kit'

import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from '$lib/features/todos/services/todos.service'
import { validateTodoTitle } from '$lib/features/todos/validation/todo'

import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
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

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData()
    const rawTitle = formData.get('title')
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''

    const validationError = validateTodoTitle(title)
    if (validationError) {
      return fail(400, { actionError: validationError, title })
    }

    try {
      const created = await createTodo({ title: title.trim(), completed: false, userId: 1 })
      return { success: true, createdTodo: { ...created, id: Date.now() } }
    } catch {
      return fail(500, { actionError: 'Could not add todo', title })
    }
  },

  toggle: async ({ request }) => {
    const formData = await request.formData()
    const rawId = formData.get('id')
    const rawCompleted = formData.get('completed')

    const id = typeof rawId === 'string' ? Number(rawId) : Number.NaN
    const completed = rawCompleted === 'true'

    if (Number.isNaN(id)) {
      return fail(400, { actionError: 'Invalid todo id' })
    }

    try {
      await updateTodo(id, { completed: !completed })
      return { success: true }
    } catch {
      return fail(500, { actionError: 'Could not toggle todo' })
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData()
    const rawId = formData.get('id')
    const id = typeof rawId === 'string' ? Number(rawId) : Number.NaN

    if (Number.isNaN(id)) {
      return fail(400, { actionError: 'Invalid todo id' })
    }

    try {
      await deleteTodo(id)
      return { success: true }
    } catch {
      return fail(500, { actionError: 'Could not delete todo' })
    }
  },
} satisfies Actions
