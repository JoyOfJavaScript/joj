import {
    parentPort, workerData
} from 'worker_threads'
import Builders from '../../../domain.js'
import proofOfWork from './proof_of_work2.js'

const { Block: BlockBuilder } = Builders
const { at, linkedTo, withPendingTransactions, withDifficulty, build: newBlock } = BlockBuilder

// HTML structured clone algorithm does not perform a full clone, so need to rehydrate a new block object from passed-in blockData
const block = {}
    :: at(workerData.index)
    :: linkedTo(workerData.previousHash)
    :: withPendingTransactions(workerData.data)
    :: withDifficulty(workerData.difficulty)
    :: newBlock()

proofOfWork(block)

parentPort.postMessage(block)