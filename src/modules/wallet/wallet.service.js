import {randomUUID} from 'crypto'
import {withTransaction} from '../../db/transaction.js'
import * as walletRepo from './wallet.repo.js'
import { WalletNotFoundError} from '../../utils/errors.js'

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