export interface ResponseBoilerPlate<T> {
  type: string,
  message: string
  code: number
  data: T
}

export type AuthResponse = ResponseBoilerPlate<{
  inviteOnly: boolean
  setup: boolean
}>

export type UserInfoResponse = ResponseBoilerPlate<{
  id: number
  username: string
  role: 'USER' | 'ADMIN' | 'INIT'
}>

export type UserSignInResponse = ResponseBoilerPlate<{
  id: number
  username: string
  role: 'USER' | 'ADMIN' | 'INIT'
  accessToken: string
}>
