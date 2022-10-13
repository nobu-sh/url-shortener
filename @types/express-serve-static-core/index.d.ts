import { ResponseHandler } from '../../server/utils'

declare global {
  declare namespace Express {
    export interface Response {
      pond: ResponseHandler
    }
  }
}
