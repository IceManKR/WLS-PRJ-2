export class WalletNotFoundError extends Error {
  constructor(walletId) {
    super(`Wallet not found: ${walletId}`)
    this.name = 'WalletNotFoundError'
  }
}

export class WalletBlockedError extends Error {
  constructor(walletId) {
    super(`Wallet is blocked: ${walletId}`)
    this.name = 'WalletBlockedError'
  }
}

export class CurrencyMismatchError extends Error {
  constructor() {
    super('Currency mismatch between wallets')
    this.name = 'CurrencyMismatchError'
  }
}

export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds')
    this.name = 'InsufficientFundsError'
  }
}
