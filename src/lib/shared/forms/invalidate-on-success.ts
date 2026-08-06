import { invalidateAll } from '$app/navigation'
import type { SubmitFunction } from '@sveltejs/kit'

export const invalidateOnSuccess: SubmitFunction = () => {
  return async ({ result, update }) => {
    await update()
    if (result.type === 'success') {
      await invalidateAll()
    }
  }
}
