import * as walletService from './wallet.service.js'

export async function createWalletController(req, res, next) {
    try {
        const { currency } = req.body
        const wallet = await walletService.createWallet({ currency })
        res.status(201).json(wallet)
    } catch (err) {
        next(err)
    }
}

export async function getWalletController(req, res, next) {
    try {
        const { id } = req.params

        const wallet = await walletService.getWallet(id)

        res.status(200).json(wallet)
    } catch (err) {
        next(err)
    }
}

export async function getWalletTransactionsController(req, res, next) {
    try {
        const { id } = req.params
        const page = req.validated?.query?.page ?? parseInt(req.query.page || '1', 10)
        const limit = req.validated?.query?.limit ?? parseInt(req.query.limit || '20', 10)

        const transactions = await walletService.getWalletTransactions(id, { page, limit })

        res.status(200).json(transactions)
    } catch (err) {
        next(err)
    }
}

export async function blockWalletController(req, res, next) {
    try {
        const { id } = req.params
        const result = await walletService.blockWallet(id)
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export async function unblockWalletController(req, res, next) {
    try {
        const { id } = req.params
        const result = await walletService.unblockWallet(id)
        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}