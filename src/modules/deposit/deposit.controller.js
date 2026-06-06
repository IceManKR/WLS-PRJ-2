import { executeDeposit } from './deposit.service.js'

export async function depositController(req, res, next) {
  try {
    const { walletId, amount, currency, referenceId } = req.body

    const result = await executeDeposit({
      walletId,
      amount,
      currency,
      referenceId,
    })

    return res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
