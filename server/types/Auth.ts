export interface NewUser {
  username: string
  password: string
  key?: string
}

export interface AuthUser {
  username: string
  password: string
  extended?: boolean
}
