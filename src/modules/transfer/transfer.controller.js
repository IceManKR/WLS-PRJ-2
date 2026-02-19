import { executeTransfer } from './transfer.service.js'
export async function transferController(req, res, next) {
  try {
    const {
      fromWalletId,
      toWalletId,
      amount,
      currency,
      referenceId,
    } = req.body

    const result = await executeTransfer({
      fromWalletId,
      toWalletId,
      amount,
      currency,
      referenceId,
    })

    console.log("TRANSFER RESULT:", result)

    return res.status(200).json(result)

  } catch (err) {
    console.log("CAUGHT ERROR:", err)
    next(err)
  }
}
