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

export async function getTransactions(walletId, limit = 20, offset = 0){
    const res = await pool.query(
        `
        SELECT type, amount, reference_id as referenceId, created_at as createdAt
        FROM ledger_entries
        WHERE wallet_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [walletId, limit, offset]
    )

    return res.rows
}