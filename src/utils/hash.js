import crypto from 'crypto'

export function hashRequest(body) {
  const json = JSON.stringify(body)
  return crypto.createHash('sha256').update(json).digest('hex')
}
