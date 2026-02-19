export function errorHandler(err, req, res, next) {
  console.log('🔥 FULL ERROR OBJECT:')
  console.log(err)
  console.log('🔥 ERROR MESSAGE:', err.message)
  console.log('🔥 ERROR STACK:', err.stack)

  res.status(500).json({
    message: err.message,
  })
}
