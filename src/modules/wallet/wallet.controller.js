import { createWallet, getWallet} from './wallet.service.js'

export async function createWalletController(req,res,next){
    try{
        const{currency}=req.body
        const wallet = await createWallet({currency})
        res.status(201).json(wallet)
    }catch(err){
        next(err)
    }
}
export async function getWalletController(req,res,next){
    try{
        const { id } = req.params

        const wallet=await getWallet(id)

        res.staus(200).json(wallet)
    }catch(err){
        next(err)
    }
}