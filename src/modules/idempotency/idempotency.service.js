import * as repo from './idempotency.repo.js'

export async function getStoredResponse(key,client){
    return repo.findfByKey(key,client)
}

export async function storeResponse(key,response,client){
    return repo.save(key,response,client)
}