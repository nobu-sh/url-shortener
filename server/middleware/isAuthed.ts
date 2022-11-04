import {
  Request, Response, NextFunction, 
} from 'express'
import { User } from '../database/models'
import { userTokenValid } from '../utils'

export const isAuthed =
  (role: 'ADMIN' | 'INIT' | 'USER' = 'USER') =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = req.headers.authorization ?? req.headers.Authorization
        if (typeof auth !== 'string') return res.pond.BadRequest({
          notice: 'Authorization header must be a string!',
        })
        if (!auth.startsWith('Bearer ')) return res.pond.BadRequest({
          notice: 'Authorization header must provide token type!',
        })
  
        const token = auth.slice(7)
        const verify = userTokenValid(token)

        if (!verify) return res.pond.Unauthorized({ notice: 'Authentication expired!' })
        res.uid = verify.uid
        const user = await User.findOne({ where: { id: res.uid } })
        if (!user) return res.pond.Error()
        res.user = user

        if (role === 'ADMIN' && !['ADMIN', 'INIT'].includes(res.user.getDataValue('role')))
          return res.pond.Forbidden({ notice: 'Endpoint requires ADMIN role!' })
        else if (role === 'INIT' && res.user.getDataValue('role') !== 'INIT')
          return res.pond.Forbidden({ notice: 'Endpoint requires INIT role!' })
          
        next()
      } catch (error) {
        console.error('[Server] [isAuthed]', error)
        res.pond.Error()
      }
    }
