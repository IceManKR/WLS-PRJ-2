import request from 'supertest'
import { randomUUID } from 'crypto'
import app from '../src/app.js'

const api = request(app)

async function createWallet() {
  const response = await api.post('/wallet').send({ currency: 'USD' })
  expect(response.status).toBe(201)
  return response.body
}

describe('Wallet Ledger API integration', () => {
  let walletA
  let walletB

  test('create wallet', async () => {
    walletA = await createWallet()
    expect(walletA).toHaveProperty('id')
    expect(walletA.currency).toBe('USD')
    expect(walletA.balance).toBe(0)
    expect(walletA.status).toBe('ACTIVE')
  })

  test('deposit into wallet', async () => {
    const response = await api.post('/deposit').send({
      walletId: walletA.id,
      amount: 1000,
      currency: 'USD',
      referenceId: randomUUID(),
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('SUCCESS')
    expect(response.body.amount).toBe(1000)
  })

  test('withdraw from wallet', async () => {
    const response = await api.post('/withdraw').send({
      walletId: walletA.id,
      amount: 200,
      currency: 'USD',
      referenceId: randomUUID(),
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('SUCCESS')
    expect(response.body.amount).toBe(200)
  })

  test('transfer between wallets', async () => {
    walletB = await createWallet()

    const response = await api.post('/transfer').send({
      fromWalletId: walletA.id,
      toWalletId: walletB.id,
      amount: 300,
      currency: 'USD',
      referenceId: randomUUID(),
    })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('SUCCESS')
    expect(response.body.amount).toBe(300)
  })

  test('transaction history is sorted newest first and paginated', async () => {
    const response = await api.get(`/wallet/${walletA.id}/transactions?page=1&limit=3`)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeLessThanOrEqual(3)
    expect(response.body[0]).toEqual(expect.objectContaining({ type: 'TRANSFER_DEBIT' }))
    expect(response.body[1]).toEqual(expect.objectContaining({ type: 'WITHDRAW_DEBIT' }))
    expect(response.body[2]).toEqual(expect.objectContaining({ type: 'DEPOSIT_CREDIT' }))
  })

  test('insufficient funds returns error', async () => {
    const response = await api.post('/withdraw').send({
      walletId: walletA.id,
      amount: 1000000,
      currency: 'USD',
      referenceId: randomUUID(),
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Insufficient funds/)
  })

  test('blocked wallet cannot withdraw', async () => {
    const walletC = await createWallet()
    const blockResponse = await api.post(`/wallet/${walletC.id}/block`).send()
    expect(blockResponse.status).toBe(200)
    expect(blockResponse.body.status).toBe('BLOCKED')

    const response = await api.post('/withdraw').send({
      walletId: walletC.id,
      amount: 50,
      currency: 'USD',
      referenceId: randomUUID(),
    })

    expect(response.status).toBe(403)
    expect(response.body.message).toMatch(/blocked/)
  })

  test('idempotency returns the same response and does not duplicate', async () => {
    const walletD = await createWallet()
    const key = randomUUID()
    const body = {
      walletId: walletD.id,
      amount: 100,
      currency: 'USD',
      referenceId: randomUUID(),
    }

    const first = await api.post('/deposit').set('Idempotency-Key', key).send(body)
    expect(first.status).toBe(200)

    const second = await api.post('/deposit').set('Idempotency-Key', key).send(body)
    expect(second.status).toBe(200)
    expect(second.body).toEqual(first.body)

    const walletResponse = await api.get(`/wallet/${walletD.id}`)
    expect(walletResponse.body.balance).toBe(100)
  })
})
