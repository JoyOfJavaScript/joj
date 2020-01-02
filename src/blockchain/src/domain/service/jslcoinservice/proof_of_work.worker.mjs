import {
    parentPort, workerData
} from 'worker_threads'
import Builder from '../../../domain.mjs'
import proofOfWork from './proof_of_work2.mjs'

// HTML structured clone algorithm does not perform a full clone, so need to rehydrate a new block object from passed-in blockData
const block = new Builder.Block()
    .at(workerData.index)
    .linkedTo(workerData.previousHash)
    .withPendingTransactions(workerData.data)
    .withDifficulty(workerData.difficulty)
    .build()

proofOfWork(block, ''.padStart(workerData.difficulty, '0'))

parentPort.postMessage(block)