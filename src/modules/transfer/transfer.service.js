import { withTransaction } from '../../db/transaction.js'
import * as walletRepo from '../wallet/wallet.repo.js'
import * as ledgerRepo from '../ledger/ledger.repo.js'
import {
    WalletNotFoundError,
    WalletBlockedError,
    CurrencyMismatchError,
    InsufficientFundsError,
} from '../../utils/errors.js'

export async function executeTransfer({
    fromWalletId,
    toWalletId,
    amount,
    currency,
    referenceId,
}){
    return withTransaction(async (client)=>{
        //Lock wallets
        const fromWallet=await walletRepo.getWalletForUpdate(
            fromWalletId,
            client
        )
        const toWallet=await walletRepo.getWalletForUpdate(
            toWalletId,
            client
        )
        
        //Validate Wallet exists
        if(!fromWallet){
            throw new WalletNotFoundError(fromWalletId)
        }
        if(!toWallet){
            throw new WalletNotFoundError(toWalletId)
        }
        //Validate Wallet Status
        if(fromWallet.status!=='ACTIVE'){
            throw new WalletBlockedError(fromWalletId)
        }

        if (toWallet.status!=='ACTIVE'){
            throw new WalletBlockedError(toWalletId)
        }

        //Validate Currency
        if(
            fromWallet.currency!==currency||
            toWallet.currency!==currency
        ){
            throw new CurrencyMismatchError()
        }
        //Validate Sufficient Balance
        if(fromWallet.balance<amount){
            throw new InsufficientFundsError()
        }
        //Writes Ledger Entried (Double Entry Accounting)
        await ledgerRepo.insertLedgerEntry(
            {
                walletId:fromWalletId,
                amount:-amount,
                type:'TRANSFER_DEBIT',
                referenceId,
            },
            client
        )
        await ledgerRepo.insertLedgerEntry(
            {
                walletdId:toWalletId,
                amount:amount,
                type:'TRANSFER_CREDIT',
                referenceId,
            },
            client
        )
        //Update Cached Balances
        await walletRepo.updateBalance(fromWalletId,-amount,client)
        await walletRepo.updateBalance(toWalletId,amount,client)

        //Return Result
        return{
            referenceId,
            fromWalletId,
            toWalletId,
            amount,
            currency,
            status:'SUCCESS',
        }
       
    })
}