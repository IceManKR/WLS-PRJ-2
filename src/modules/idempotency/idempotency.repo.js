export async function findByKey(key,client){
    const res =  await client.query(
        `
        SELECT response
        FROM idempotency_keys
        WHERE key = $1
        `,
        [key]
    )
    return res.rows[0]
}

export async function save(key,response,client){
    await client.query(
        `
        INSET INTO idempotency_keys (key,response)
        VALUES ($1,$2)
        `,
        [key.response]
    )
}