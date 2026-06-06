import { config } from '../src/config/env.js'
import { pool } from '../src/db/pool.js'
import { randomUUID } from 'crypto'

async function main() {
  const wallets = [
    { id: 'f41b8a17-0b66-45bf-84fb-bcaaf4d04e77', currency: 'INR', balance: 10000, status: 'ACTIVE' },
    { id: '698ddab8-1d9a-467e-a5c5-c07ee81b5b11', currency: 'INR', balance: 5000, status: 'ACTIVE' },
    { id: '2537f57e-8ad8-4117-90f2-1660f27fc9a9', currency: 'INR', balance: 2500, status: 'ACTIVE' },
  ]

  const ledgerEntries = [
    {
      id: 'a7df5fd1-7438-4cce-b773-bb4003d9c0f8',
      walletId: wallets[0].id,
      amount: 10000,
      type: 'DEPOSIT_CREDIT',
      referenceId: randomUUID(),
    },
    {
      id: '0a98b4fe-cdbd-4e07-9ef5-373122538c93',
      walletId: wallets[1].id,
      amount: 5000,
      type: 'DEPOSIT_CREDIT',
      referenceId: randomUUID(),
    },
    {
      id: '47b09515-6971-4827-8c7e-7a0ea3b9d407',
      walletId: wallets[2].id,
      amount: 2500,
      type: 'DEPOSIT_CREDIT',
      referenceId: randomUUID(),
    },
  ]

  try {
    for (const wallet of wallets) {
      await pool.query(
        `INSERT INTO wallets (id, currency, balance, status) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET currency = EXCLUDED.currency, balance = EXCLUDED.balance, status = EXCLUDED.status`,
        [wallet.id, wallet.currency, wallet.balance, wallet.status]
      )
    }

    for (const entry of ledgerEntries) {
      await pool.query(
        `INSERT INTO ledger_entries (id, wallet_id, amount, type, reference_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [entry.id, entry.walletId, entry.amount, entry.type, entry.referenceId]
      )
    }

    console.log('Demo accounts seeded successfully.')
  } catch (error) {
    console.error('Failed to seed demo accounts:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
