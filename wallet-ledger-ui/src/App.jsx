import { useEffect, useMemo, useState } from 'react'
import { createWallet, deposit, fetchTransactions, fetchWallets, blockWallet, transfer, unblockWallet, withdraw } from './api.js'

const pages = ['Dashboard', 'Wallets', 'Deposit', 'Withdraw', 'Transfer', 'History']
const currencies = ['USD', 'INR', 'EUR']

function formatDate(value) {
  return new Date(value).toLocaleString()
}

function App() {
  const [page, setPage] = useState('Dashboard')
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ currency: 'USD', walletId: '', amount: '', toWalletId: '' })

  const totalBalance = useMemo(
    () => wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0),
    [wallets]
  )

  const refreshData = async () => {
    try {
      setLoading(true)
      const [walletsData, transactionData] = await Promise.all([fetchWallets(), fetchTransactions(15)])
      setWallets(walletsData)
      setTransactions(transactionData)
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleCreateWallet = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await createWallet(form.currency)
      setStatus('Wallet created successfully.')
      setForm((prev) => ({ ...prev, walletId: '' }))
      await refreshData()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await deposit({
        walletId: form.walletId,
        amount: Number(form.amount),
        currency: form.currency,
        referenceId: crypto.randomUUID(),
      })
      setStatus('Deposit completed.')
      await refreshData()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await withdraw({
        walletId: form.walletId,
        amount: Number(form.amount),
        currency: form.currency,
        referenceId: crypto.randomUUID(),
      })
      setStatus('Withdrawal completed.')
      await refreshData()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await transfer({
        fromWalletId: form.walletId,
        toWalletId: form.toWalletId,
        amount: Number(form.amount),
        currency: form.currency,
        referenceId: crypto.randomUUID(),
      })
      setStatus('Transfer completed.')
      await refreshData()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockToggle = async (wallet) => {
    try {
      setLoading(true)
      if (wallet.status === 'BLOCKED') {
        await unblockWallet(wallet.id)
        setStatus(`Wallet ${wallet.id} unblocked.`)
      } else {
        await blockWallet(wallet.id)
        setStatus(`Wallet ${wallet.id} blocked.`)
      }
      await refreshData()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Wallet Ledger</h1>
        <nav>
          {pages.map((item) => (
            <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main>
        <header>
          <h2>{page}</h2>
          <p className="status">{status}</p>
        </header>

        {loading && <div className="loading">Loading...</div>}

        {page === 'Dashboard' && (
          <section>
            <div className="stat-grid">
              <div className="stat-card">
                <span>Total wallets</span>
                <strong>{wallets.length}</strong>
              </div>
              <div className="stat-card">
                <span>Total balance</span>
                <strong>{totalBalance.toLocaleString()}</strong>
              </div>
            </div>

            <div className="pane">
              <h3>Wallet Balances</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id}>
                      <td>{wallet.id}</td>
                      <td>{wallet.currency}</td>
                      <td>{wallet.balance}</td>
                      <td>{wallet.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pane">
              <h3>Recent Transactions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.walletId}</td>
                      <td>{tx.type}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.referenceId}</td>
                      <td>{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === 'Wallets' && (
          <section>
            <div className="pane">
              <h3>Create Wallet</h3>
              <form onSubmit={handleCreateWallet}>
                <label>
                  Currency
                  <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit">Create wallet</button>
              </form>
            </div>

            <div className="pane">
              <h3>Wallet List</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id}>
                      <td>{wallet.id}</td>
                      <td>{wallet.currency}</td>
                      <td>{wallet.balance}</td>
                      <td>{wallet.status}</td>
                      <td>
                        <button onClick={() => handleBlockToggle(wallet)}>
                          {wallet.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === 'Deposit' && (
          <section className="pane form-pane">
            <h3>Deposit</h3>
            <form onSubmit={handleDeposit}>
              <label>
                Wallet ID
                <input value={form.walletId} onChange={(event) => setForm({ ...form, walletId: event.target.value })} required />
              </label>
              <label>
                Amount
                <input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
              </label>
              <label>
                Currency
                <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Deposit</button>
            </form>
          </section>
        )}

        {page === 'Withdraw' && (
          <section className="pane form-pane">
            <h3>Withdraw</h3>
            <form onSubmit={handleWithdraw}>
              <label>
                Wallet ID
                <input value={form.walletId} onChange={(event) => setForm({ ...form, walletId: event.target.value })} required />
              </label>
              <label>
                Amount
                <input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
              </label>
              <label>
                Currency
                <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Withdraw</button>
            </form>
          </section>
        )}

        {page === 'Transfer' && (
          <section className="pane form-pane">
            <h3>Transfer</h3>
            <form onSubmit={handleTransfer}>
              <label>
                From Wallet
                <input value={form.walletId} onChange={(event) => setForm({ ...form, walletId: event.target.value })} required />
              </label>
              <label>
                To Wallet
                <input value={form.toWalletId} onChange={(event) => setForm({ ...form, toWalletId: event.target.value })} required />
              </label>
              <label>
                Amount
                <input type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
              </label>
              <label>
                Currency
                <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Transfer</button>
            </form>
          </section>
        )}

        {page === 'History' && (
          <section className="pane">
            <h3>Transaction History</h3>
            <table>
              <thead>
                <tr>
                  <th>Wallet</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.walletId}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.referenceId}</td>
                    <td>{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
