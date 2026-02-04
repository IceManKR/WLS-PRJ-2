import { withTransaction } from '../db/transaction.js'
import {
    getStoredResponse,
    storeResponse,
} from '../modules/idempotency/idempotency.service.js'

export function idempotencyMiddleware(req,res,next){
    const key=req.headers['idempotency-key']

    if(!key){
        return next()
    }
    withTransaction(async(client)=>{
        const existing =  await getStoredResponse(key,client)
        if(existing){
            res.status(200).json(exiising.response)
            return
        }
        const originalJson=res.json.bind(res)

        res.json=async (body)=>{
            await storeResponse(key,body,client)
            return originalJson(body)
        }
        next()
    }).catch(next)
}