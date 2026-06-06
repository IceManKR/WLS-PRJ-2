import { z } from 'zod'

const uuid = z.string().uuid()
const currency = z.string().min(1)
const positiveAmount = z.number().positive()

const parsePositiveInt = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value)
  }
  return value
}, z.number().int().positive())

export const createWalletSchema = z.object({
  body: z.object({
    currency,
  }),
})

export const depositSchema = z.object({
  body: z.object({
    walletId: uuid,
    amount: positiveAmount,
    currency,
    referenceId: uuid,
  }),
})

export const withdrawSchema = z.object({
  body: z.object({
    walletId: uuid,
    amount: positiveAmount,
    currency,
    referenceId: uuid,
  }),
})

export const transferSchema = z.object({
  body: z.object({
    fromWalletId: uuid,
    toWalletId: uuid,
    amount: positiveAmount,
    currency,
    referenceId: uuid,
  }),
})

export const walletIdParamsSchema = z.object({
  params: z.object({
    id: uuid,
  }),
})

export const transactionHistorySchema = z.object({
  params: z.object({
    id: uuid,
  }),
  query: z.object({
    page: parsePositiveInt.default(1),
    limit: parsePositiveInt.default(20),
  }),
})
