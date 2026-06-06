$base = "http://localhost:3000"

# 1) Create wallet and capture id
$create = Invoke-RestMethod -Method Post -Uri "$base/wallet" -ContentType 'application/json' -Body '{"currency":"USD"}'
$walletId = $create.id
Write-Host "WalletId: $walletId"

# helper to make guid string
function New-RefId { [guid]::NewGuid().ToString() }

# 2) Deposit
$depositBody = @{ walletId = $walletId; amount = 1000; currency = 'USD'; referenceId = (New-RefId) } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/deposit" -ContentType 'application/json' -Body $depositBody

# 3) Withdraw
$withdrawBody = @{ walletId = $walletId; amount = 200; currency = 'USD'; referenceId = (New-RefId) } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/withdraw" -ContentType 'application/json' -Body $withdrawBody

# 4) Get wallet (balance/status)
Invoke-RestMethod -Uri "$base/wallet/$walletId" | ConvertTo-Json -Depth 5

# 5) Transactions (paginated)
Invoke-RestMethod -Uri "$base/wallet/$walletId/transactions?page=1&limit=20" | ConvertTo-Json -Depth 5
