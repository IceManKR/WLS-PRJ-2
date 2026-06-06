import { executeWithdraw } from './withdraw.service.js'

export async function withdrawController(req, res, next) {
  try {
    const { walletId, amount, currency, referenceId } = req.body

    const result = await executeWithdraw({
      walletId,
      amount,
      currency,
      referenceId
    })

    return res.status(200).json(result)

  } catch (err) {
    next(err)
  }
}