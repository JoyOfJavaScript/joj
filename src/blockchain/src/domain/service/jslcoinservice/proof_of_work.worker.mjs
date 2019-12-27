import {
    parentPort, workerData
} from 'worker_threads'
import Block from '../../Block.mjs'
import proofOfWork from './proof_of_work2.mjs'

const blockData = workerData
// HTML structured clone algorithm does not perform a full clone, so need to rehydrate a new block object from passed-in blockData
const block = new Block(blockData.index, blockData.previousHash, blockData.data, blockData.difficulty)
proofOfWork(block, ''.padStart(blockData.difficulty, '0'))
console.log('Post-back block data: ', block)
parentPort.postMessage(block)