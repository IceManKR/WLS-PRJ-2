export async function insertKey(key, requestHash, client) {
  return client.query(
    `
    INSERT INTO idempotency_keys (key, request_hash, response, status_code)
    VALUES ($1, $2, '{}'::jsonb, 0)
    `,
    [key, requestHash]
  )
}

export async function updateResponse(key, response, statusCode, client) {
  await client.query(
    `
    UPDATE idempotency_keys
    SET response = $1,
        status_code = $2
    WHERE key = $3
    `,
    [response, statusCode, key]
  )
}

export async function findByKey(key, client) {
  const result = await client.query(
    `
    SELECT * FROM idempotency_keys
    WHERE key = $1
    `,
    [key]
  )

  return result.rows[0]
}
