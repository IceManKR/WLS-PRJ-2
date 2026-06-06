import { ZodError } from 'zod'

export function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })

      req.body = result.body ?? req.body
      req.params = result.params ?? req.params
      req.validated = result

      next()
    } catch (err) {
      if (err instanceof ZodError) {
        err.statusCode = 400
      }
      next(err)
    }
  }
}
