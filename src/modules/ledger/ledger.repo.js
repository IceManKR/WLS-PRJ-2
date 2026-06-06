import { randomUUID } from 'crypto'
import { pool } from '../../db/pool.js'

export async function insertLedgerEntry(
    { walletId, amount, type, referenceId },
    client
){
    await client.query(
        `
        INSERT INTO ledger_entries (id, wallet_id, amount, type, reference_id)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [randomUUID(), walletId, amount, type, referenceId]
    )
}

export async function getTransactions(walletId, limit = 20, offset = 0) {
    const res = await pool.query(
        `
        SELECT id,
               wallet_id AS "walletId",
               type,
               amount,
               reference_id AS "referenceId",
               created_at AS "createdAt"
        FROM ledger_entries
        WHERE wallet_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [walletId, limit, offset]
    )

    return res.rows
}

export async function getRecentTransactions(limit = 20) {
    const res = await pool.query(
        `
        SELECT id,
               wallet_id AS "walletId",
               type,
               amount,
               reference_id AS "referenceId",
               created_at AS "createdAt"
        FROM ledger_entries
        ORDER BY created_at DESC
        LIMIT $1
        `,
        [limit]
    )

    return res.rows
}