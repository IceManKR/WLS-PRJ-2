import cors from 'cors'
import express from 'express'
import { createWalletController, getWalletController, getWalletTransactionsController, blockWalletController, unblockWalletController, getAllWalletsController, getAllTransactionsController } from './modules/wallet/wallet.controller.js'
import { transferController } from './modules/transfer/transfer.controller.js'
import { idempotencyMiddleware } from './middlewares/idempotency.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { withdrawController } from './modules/withdraw/withdraw.controller.js'
import { depositController } from './modules/deposit/deposit.controller.js'
import { validate } from './middlewares/validation.js'
import {
  createWalletSchema,
  depositSchema,
  withdrawSchema,
  transferSchema,
  transactionHistorySchema,
  transactionsListSchema,
  walletIdParamsSchema,
} from './schemas/requestSchemas.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/openapi.js'

const app=express()
app.use(express.json())
app.use(cors())

app.use(idempotencyMiddleware)
app.get('/',(req,res)=>{
    res.send('OK')
})
app.post('/wallet', validate(createWalletSchema), createWalletController)
app.get('/wallet/:id', validate(walletIdParamsSchema), getWalletController)
app.get('/wallet/:id/transactions', validate(transactionHistorySchema), getWalletTransactionsController)
app.get('/wallets', getAllWalletsController)
app.get('/transactions', validate(transactionsListSchema), getAllTransactionsController)

app.post('/transfer', validate(transferSchema), transferController)
app.post('/withdraw', validate(withdrawSchema), withdrawController)
app.post('/deposit', validate(depositSchema), depositController)
app.post('/wallet/:id/block', validate(walletIdParamsSchema), blockWalletController)
app.post('/wallet/:id/unblock', validate(walletIdParamsSchema), unblockWalletController)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)

export default app