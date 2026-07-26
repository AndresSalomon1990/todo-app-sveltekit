import { describe, expect, it } from 'vitest';

import { validateTodoTitle } from './todo';

describe('todo validation', () => {
  it('accepts a valid title', () => {
    expect(validateTodoTitle('Valid Title')).toBeNull();
  });

  it('rejects an empty title', () => {
    expect(validateTodoTitle('')).toBe("Todo can't be empty");
  })

  it('rejects short titles', () => {
    expect(validateTodoTitle('Hi')).toBe("Todo must be at least 3 characters long");
  });

  it('rejects long titles', () => {
    expect(validateTodoTitle('A'.repeat(81))).toBe("Todo can't be longer than 80 characters");
  });
})
