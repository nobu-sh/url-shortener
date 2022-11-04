const usernameRegex = /^\w+$/
const passwordRegex = /^[a-zA-Z0-9_!@#$%^&*]+$/

export function usernameValidator(u: string): string | undefined {
  if (u.length < 1 || u.length > 32) return 'Must be between 1 - 32 characters'
  if (!usernameRegex.test(u)) return 'May only contain: letters, numbers, underscores'

  return undefined
}

export function passwordValidator(p: string): string | undefined {
  if (p.length < 5 || p.length > 64) return 'Must be between 5 - 64 characters'
  if (!passwordRegex.test(p)) return 'May only contain: letters, number, _@#$%^&*'

  return undefined
}
