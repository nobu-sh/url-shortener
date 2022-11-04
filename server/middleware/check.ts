import {
  Request, Response, NextFunction, 
} from 'express'
import { Body } from '../types'

export type Awaitable<T> = PromiseLike<T> | T
// eslint-disable-next-line @typescript-eslint/ban-types
export type CheckCallback<T extends object> = (req: Body<T>, res: Response, next: NextFunction) => Awaitable<void>
export const check = 
  // eslint-disable-next-line @typescript-eslint/ban-types
  <T extends object>(cb: CheckCallback<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      await cb(req, res, next)
    }
