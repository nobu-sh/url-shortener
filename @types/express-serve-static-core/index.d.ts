import { User } from '../../server/database/models'
import { ResponseHandler } from '../../server/utils'

declare global {
  declare namespace Express {
    export interface Response {
      pond: ResponseHandler
      /**
       * Will only be populated when isAuthed middleware is used
       */
      uid?: number
      /**
       * Will only be populated when isAuthed middleware is used
       */
      user?: User
    }
  }
}
