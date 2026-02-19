import { randomUUID } from 'crypto'

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