import {
  Request, Response, NextFunction, 
} from 'express'
import { ObjectSchema } from 'joi'

export const validate =
  (validator: ObjectSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      // -> Attempt validate
      const validate = validator.validate(req.body)
      // -> If error return bad request
      if (validate.error)
        return res.pond.BadRequest({
          message: validate.error.message,
        })

      // -> Continue request
      return next()
    }
