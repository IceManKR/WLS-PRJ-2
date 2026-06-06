CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY,
  currency TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL CHECK (amount <> 0),
  type TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  request_hash TEXT NOT NULL,
  response JSONB NOT NULL,
  status_code INT NOT NULL
);

INSERT INTO wallets (id, currency, balance, status)
VALUES
  ('f41b8a17-0b66-45bf-84fb-bcaaf4d04e77', 'INR', 10000, 'ACTIVE'),
  ('698ddab8-1d9a-467e-a5c5-c07ee81b5b11', 'INR', 5000, 'ACTIVE'),
  ('2537f57e-8ad8-4117-90f2-1660f27fc9a9', 'INR', 2500, 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET currency = EXCLUDED.currency, balance = EXCLUDED.balance, status = EXCLUDED.status;

INSERT INTO ledger_entries (id, wallet_id, amount, type, reference_id)
VALUES
  ('a7df5fd1-7438-4cce-b773-bb4003d9c0f8', 'f41b8a17-0b66-45bf-84fb-bcaaf4d04e77', 10000, 'DEPOSIT_CREDIT', 'demo-deposit-1'),
  ('0a98b4fe-cdbd-4e07-9ef5-373122538c93', '698ddab8-1d9a-467e-a5c5-c07ee81b5b11', 5000, 'DEPOSIT_CREDIT', 'demo-deposit-2'),
  ('47b09515-6971-4827-8c7e-7a0ea3b9d407', '2537f57e-8ad8-4117-90f2-1660f27fc9a9', 2500, 'DEPOSIT_CREDIT', 'demo-deposit-3')
ON CONFLICT (id) DO NOTHING;
