# Wallet Ledger System

## Run locally

1. Install dependencies:
```bash
npm install
```

2. Start the API:
```bash
npm run dev
```

3. Open API docs:
```bash
http://localhost:3000/docs
```

## Run integration tests

```bash
npm test
```

## Run with Docker

```bash
docker compose up --build
```

This starts:
- `api` on port `3000`
- `postgres` on port `5432`

## Endpoints

- `POST /wallet`
- `GET /wallet/:id`
- `GET /wallet/:id/transactions?page=1&limit=20`
- `POST /deposit`
- `POST /withdraw`
- `POST /transfer`
- `POST /wallet/:id/block`
- `POST /wallet/:id/unblock`
- `GET /docs`
