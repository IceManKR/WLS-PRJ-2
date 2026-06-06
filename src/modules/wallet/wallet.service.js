import {randomUUID} from 'crypto'
import {withTransaction} from '../../db/transaction.js'
import * as walletRepo from './wallet.repo.js'
import { WalletNotFoundError} from '../../utils/errors.js'
import * as ledgerRepo from '../ledger/ledger.repo.js'
import { pool } from '../../db/pool.js'

export async function createWallet({currency}){
    const id=randomUUID()

    return withTransaction(async(client)=>{
        await walletRepo.insertWallet({id,currency},client)

        return{
            id,
            currency,
            balance:0,
            status:'ACTIVE',
        }
    })
}

export async function getWallet(id){
    return withTransaction(async(client)=>{
        const wallet = await walletRepo.findById(id,client)

        if(!wallet){
            throw new WalletNotFoundError(id)
        }
        return{
            id: wallet.id,
            currency:wallet.currency,
            balance:wallet.balance,
            status:wallet.status,
        }
    })
}

export async function getWalletTransactions(id, { page = 1, limit = 20 } = {}){
    const offset = (page - 1) * limit

    // ensure wallet exists
    const check = await pool.query(
        `SELECT id FROM wallets WHERE id = $1`,
        [id]
    )
    if (check.rowCount === 0) {
        throw new WalletNotFoundError(id)
    }

    const rows = await ledgerRepo.getTransactions(id, limit, offset)

    return rows.map(r => ({ type: r.type, amount: Number(r.amount) }))
}

export async function blockWallet(id) {
    return withTransaction(async (client) => {
        const wallet = await walletRepo.getWalletForUpdate(id, client)
        if (!wallet) {
            throw new WalletNotFoundError(id)
        }

        await walletRepo.updateWalletStatus(id, 'BLOCKED', client)
        return {
            id,
            status: 'BLOCKED',
        }
    })
}

export async function unblockWallet(id) {
    return withTransaction(async (client) => {
        const wallet = await walletRepo.getWalletForUpdate(id, client)
        if (!wallet) {
            throw new WalletNotFoundError(id)
        }

        await walletRepo.updateWalletStatus(id, 'ACTIVE', client)
        return {
            id,
            status: 'ACTIVE',
        }
    })
}
