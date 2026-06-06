import { withTransaction } from '../../db/transaction.js'
import * as walletRepo from '../wallet/wallet.repo.js'
import * as ledgerRepo from '../ledger/ledger.repo.js'
import {
  WalletNotFoundError,
  WalletBlockedError,
  CurrencyMismatchError,
  InsufficientFundsError,
} from '../../utils/errors.js'

export async function executeWithdraw({
  walletId,
  amount,
  currency,
  referenceId,
}) {
  if (amount <= 0) {
    throw new Error('Withdraw amount must be greater than zero')
  }

  return withTransaction(async (client) => {

    const wallet = await walletRepo.getWalletForUpdate(walletId, client)

    if (!wallet) {
      throw new WalletNotFoundError(walletId)
    }

    if (wallet.status !== 'ACTIVE') {
      throw new WalletBlockedError(walletId)
    }

    if (wallet.currency !== currency) {
      throw new CurrencyMismatchError()
    }

    if (wallet.balance < amount) {
      throw new InsufficientFundsError()
    }

    await ledgerRepo.insertLedgerEntry(
      {
        walletId,
        amount: -amount,
        type: 'WITHDRAW_DEBIT',
        referenceId,
      },
      client
    )

    await walletRepo.updateBalance(walletId, -amount, client)

    return {
      referenceId,
      walletId,
      amount,
      currency,
      status: 'SUCCESS',
    }
  })
}