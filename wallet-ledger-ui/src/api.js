const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message || 'Request failed')
  }
  return body
}

export const fetchWallets = () => request('/wallets')
export const fetchTransactions = (limit = 20) => request(`/transactions?limit=${limit}`)
export const fetchWalletTransactions = (walletId, page = 1, limit = 20) => request(`/wallet/${walletId}/transactions?page=${page}&limit=${limit}`)
export const createWallet = (currency) => request('/wallet', {
  method: 'POST',
  body: JSON.stringify({ currency }),
})
export const deposit = ({ walletId, amount, currency, referenceId }) =>
  request('/deposit', {
    method: 'POST',
    body: JSON.stringify({ walletId, amount, currency, referenceId }),
  })
export const withdraw = ({ walletId, amount, currency, referenceId }) =>
  request('/withdraw', {
    method: 'POST',
    body: JSON.stringify({ walletId, amount, currency, referenceId }),
  })
export const transfer = ({ fromWalletId, toWalletId, amount, currency, referenceId }) =>
  request('/transfer', {
    method: 'POST',
    body: JSON.stringify({ fromWalletId, toWalletId, amount, currency, referenceId }),
  })
export const blockWallet = (id) => request(`/wallet/${id}/block`, { method: 'POST' })
export const unblockWallet = (id) => request(`/wallet/${id}/unblock`, { method: 'POST' })
