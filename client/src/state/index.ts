import { atom } from "recoil"

export const getStoredToken = (): string | undefined => {
  return localStorage.getItem('tkn')
}
export const setStoredToken = (str: string): void => {
  return localStorage.setItem('tkn', str)
}
export const deleteStoredToken = (): void => {
  return localStorage.removeItem('tkn')
}

export const initState = atom<boolean>({
  key: 'init',
  default: false,
})

export const inviteState = atom<boolean>({
  key: 'invite',
  default: false,
})

export const readyState = atom<boolean>({
  key: 'ready',
  default: false,
})

export interface User {
  id: number
  username: string
  role: 'USER' | 'ADMIN' | 'INIT'
  accessToken: string
}
export const userState = atom<User | undefined>({
  key: 'user',
  default: undefined,
})
