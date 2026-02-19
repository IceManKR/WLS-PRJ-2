import express from 'express'
import { createWalletController, getWalletController} from './modules/wallet/wallet.controller.js'
import { transferController } from './modules/transfer/transfer.controller.js'
import { idempotencyMiddleware } from './middlewares/idempotency.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app=express()
app.use(express.json())

app.use(idempotencyMiddleware)

app.post('/wallet', createWalletController)
app.get('/wallet/:id', getWalletController)

app.post('/transfer', transferController)

app.use(errorHandler)

export default app