export default {
  openapi: '3.0.3',
  info: {
    title: 'Wallet Ledger API',
    version: '1.0.0',
    description: 'Wallet and ledger API for deposits, withdrawals, transfers, and transaction history.',
  },
  servers: [
    { url: 'http://localhost:3000' },
  ],
  paths: {
    '/wallet': {
      post: {
        summary: 'Create wallet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  currency: { type: 'string' },
                },
                required: ['currency'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Wallet created',
          },
        },
      },
    },
    '/wallet/{id}': {
      get: {
        summary: 'Get wallet balance and status',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'Wallet details' } },
      },
    },
    '/wallet/{id}/transactions': {
      get: {
        summary: 'Get wallet transaction history',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Transaction list' } },
      },
    },
    '/wallets': {
      get: {
        summary: 'List all wallets',
        responses: { 200: { description: 'Wallet list' } },
      },
    },
    '/transactions': {
      get: {
        summary: 'List recent transactions',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Recent transactions' } },
      },
    },
    '/deposit': {
      post: {
        summary: 'Deposit into wallet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  walletId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                  referenceId: { type: 'string', format: 'uuid' },
                },
                required: ['walletId', 'amount', 'currency', 'referenceId'],
              },
            },
          },
        },
        responses: { 200: { description: 'Deposit complete' } },
      },
    },
    '/withdraw': {
      post: {
        summary: 'Withdraw from wallet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  walletId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                  referenceId: { type: 'string', format: 'uuid' },
                },
                required: ['walletId', 'amount', 'currency', 'referenceId'],
              },
            },
          },
        },
        responses: { 200: { description: 'Withdraw complete' } },
      },
    },
    '/transfer': {
      post: {
        summary: 'Transfer between wallets',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fromWalletId: { type: 'string', format: 'uuid' },
                  toWalletId: { type: 'string', format: 'uuid' },
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                  referenceId: { type: 'string', format: 'uuid' },
                },
                required: ['fromWalletId', 'toWalletId', 'amount', 'currency', 'referenceId'],
              },
            },
          },
        },
        responses: { 200: { description: 'Transfer complete' } },
      },
    },
    '/wallet/{id}/block': {
      post: {
        summary: 'Block wallet',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'Wallet blocked' } },
      },
    },
    '/wallet/{id}/unblock': {
      post: {
        summary: 'Unblock wallet',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 200: { description: 'Wallet unblocked' } },
      },
    },
  },
}
