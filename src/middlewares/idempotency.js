import { hashRequest } from '../utils/hash.js'
import * as repo from '../modules/idempotency/idempotency.repo.js'
import { withTransaction } from '../db/transaction.js'

export async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key']
  if (!key) return next()

  const requestHash = hashRequest(req.body)

  try {
    const inserted = await withTransaction(async (client) => {
      return await repo.insertKey(key, requestHash, client)
    })

    // If insert succeeded → first request
    const originalJson = res.json.bind(res)

    res.json = async (body) => {
      await withTransaction(async (client) => {
        await repo.updateResponse(
          key,
          body,
          res.statusCode,
          client
        )
      })

      return originalJson(body)
    }

    next()

  } catch (err) {
    // Duplicate key → already exists
    if (err.code === '23505') {
      const existing = await withTransaction(async (client) => {
        return await repo.findByKey(key, client)
      })

      return res
        .status(existing.status_code)
        .json(existing.response)
    }

    next(err)
  }
}
