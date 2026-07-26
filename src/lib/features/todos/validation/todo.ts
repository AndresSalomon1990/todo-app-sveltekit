export function validateTodoTitle(title: string): string | null {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    return "Todo can't be empty"
  }

  if (trimmedTitle.length < 3) {
    return 'Todo must be at least 3 characters long'
  }

  if (trimmedTitle.length > 80) {
    return "Todo can't be longer than 80 characters"
  }

  return null
}
