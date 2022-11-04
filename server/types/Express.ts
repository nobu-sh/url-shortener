// -! Imports
import { Request } from 'express'

// -> Express request body override
export interface Body<T> extends Request {
  body: T
}
