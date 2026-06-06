import { pool } from '../../db/pool.js'

export async function findById(id, client) {
  const res = await client.query(
    `
        SELECT *
        FROM wallets
        WHERE id = $1
        `,
    [id]
  )
  return res.rows[0]
}

export async function getWalletForUpdate(id, client) {
  const res = await client.query(
    `
        SELECT *
        FROM wallets
        WHERE id = $1
        FOR UPDATE
        `,
    [id]
  )
  return res.rows[0]
}

export async function getAllWallets() {
  const res = await pool.query(
    `
        SELECT id, currency, balance, status, created_at
        FROM wallets
        ORDER BY created_at DESC
        `
  )
  return res.rows
}

export async function insertWallet({ id, currency }, client) {
  await client.query(
    `
        INSERT INTO wallets (id, currency, status)
        VALUES ($1, $2, 'ACTIVE')
        `,
    [id, currency]
  )
}

export async function updateBalance(id, amountDelta, client) {
  await client.query(
    `
        UPDATE wallets
        SET balance = balance + $2
        WHERE id = $1
        `,
    [id, amountDelta]
  )
}

export async function updateWalletStatus(id, status, client) {
  await client.query(
    `
        UPDATE wallets
        SET status = $2
        WHERE id = $1
        `,
    [id, status]
  )
}
