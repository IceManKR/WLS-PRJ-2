import { ZodError } from 'zod'

const statusMap = {
  WalletNotFoundError: 404,
  WalletBlockedError: 403,
  CurrencyMismatchError: 400,
  InsufficientFundsError: 400,
}

export function errorHandler(err, req, res, next) {
  console.log('🔥 FULL ERROR OBJECT:')
  console.log(err)
  console.log('🔥 ERROR MESSAGE:', err.message)
  console.log('🔥 ERROR STACK:', err.stack)

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Invalid request payload',
      errors: err.errors,
    })
  }

  const status = err.statusCode || statusMap[err.name] || 500
  res.status(status).json({
    message: err.message,
    stack: err.stack,
  })
}
