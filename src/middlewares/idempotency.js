import { withTransaction } from '../db/transaction.js'
import {
  getStoredResponse,
  storeResponse,
} from '../modules/idempotency/idempotency.service.js'

export async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key']

  if (!key) {
    return next()
  }

  try {
    const existing = await withTransaction(async (client) => {
      return await getStoredResponse(key, client)
    })

    if (existing) {
      return res.status(200).json(existing.response)
    }

    const originalJson = res.json.bind(res)

    res.json = (body) => {
      storeResponse(key, body).catch(console.error)
      return originalJson(body)
    }

    next()
  } catch (err) {
    next(err)
  }
}
