import {
  NextFunction, Request, Response, 
} from 'express'

export interface ResponseBoilerplate {
  type: string
  message: string
  code: number
  data: Record<string, unknown>
}

export class ResponseHandler {
  protected _req: Request
  protected _res: Response

  public constructor(req: Request, res: Response) {
    this._req = req
    this._res = res
  }

  public generateBoilerplate(
    type: string,
    code: number,
    message: string,
    data?: Record<string, unknown>,
  ): ResponseBoilerplate {
    return {
      type,
      message,
      code,
      data: data ?? {},
    }
  }

  public Ok<T extends Record<string, unknown>>(data?: T, message = 'Ok'): void {
    this._res.status(200).json(this.generateBoilerplate('HttpResponse', 200, message, data))
  }

  public BadRequest<T extends Record<string, unknown>>(data?: T, message = 'Bad Request'): void {
    this._res.status(400).json(this.generateBoilerplate('HttpBadRequest', 400, message, data))
  }

  public Unauthorized<T extends Record<string, unknown>>(data?: T, message = 'Unauthorized'): void {
    this._res.status(401).json(this.generateBoilerplate('HttpUnauthorized', 401, message, data))
  }

  public Forbidden<T extends Record<string, unknown>>(data?: T, message = 'Forbidden'): void {
    this._res.status(403).json(this.generateBoilerplate('HttpForbidden', 403, message, data))
  }

  public NotAllowed<T extends Record<string, unknown>>(data?: T, message = 'Method Not Allowed'): void {
    this._res.status(405).json(this.generateBoilerplate('HttpMethodNotAllowed', 405, message, data))
  }

  public NotFound<T extends Record<string, unknown>>(data?: T, message = 'Not Found'): void {
    this._res.status(404).json(this.generateBoilerplate('HttpNotFound', 404, message, data))
  }

  public Ratelimit<T extends Record<string, unknown>>(data?: T, message = 'Too Many Requests'): void {
    this._res.status(429).json(this.generateBoilerplate('HttpTooManyRequests', 429, message, data))
  }

  public Error<T extends Record<string, unknown>>(data?: T, message = 'Server Error'): void {
    this._res.status(500).json(this.generateBoilerplate('HttpServerError', 500, message, data))
  }

  public NotImplemented<T extends Record<string, unknown>>(data?: T, message = 'Not Implemented'): void {
    this._res.status(501).json(this.generateBoilerplate('HttpNotImplemented', 501, message, data))
  }
}

export function responseHandler(req: Request, res: Response, next: NextFunction) {
  res.pond = new ResponseHandler(req, res)
  next()
}
