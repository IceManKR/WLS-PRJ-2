export async function findById(id,client){
    const res =  await client.query(
        `
        SELECT *
        FROM WALLETS
        WHERE id=$1
        `,
        [id]
    )
    return res.rows[0]
}
export async function getWalletForUpdate(id,client){
    const res = await client.query(
        `
        SELECT *
        FROM WALLETS
        WHERE id = $1
        FOR UPDATE
        `,
        [id]
    )
    return res.rows[0]
}

export async function insertWallet({id, currency},client){
    await client.query(
        `
        INSERT INTO wallets (id, currency, status)
        VALUES ($1, $2, 'ACTIVE')
        `,
        [id,currency]
    )
}
export async function updateBalance(id, amountDelta, client){
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
