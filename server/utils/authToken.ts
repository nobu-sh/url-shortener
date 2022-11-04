import jwt from 'jsonwebtoken'
import { JWTSecret } from '../Constants'
import { UserModel } from '../database/models'

export function createUserToken(user: UserModel, extended = false): string {
  return jwt.sign({ uid: user.id }, JWTSecret, { expiresIn: extended ? '720h' : '24h' })
}

export interface ValidateUserToken {
  uid: number
}

export function userTokenValid(token: string): ValidateUserToken | undefined {
  try {
    const t = jwt.verify(token, JWTSecret) as (jwt.JwtPayload & ValidateUserToken) | undefined
    
    if (!t) return undefined

    return {
      uid: t.uid,
    }
  } catch {
    return undefined
  }
}
