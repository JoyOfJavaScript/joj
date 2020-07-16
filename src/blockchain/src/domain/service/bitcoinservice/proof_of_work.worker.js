import {
    parentPort, workerData
} from 'worker_threads'
import Block from '../../Block.js'
import proofOfWork from './proof_of_work2.js'

const blockData = JSON.parse(workerData); //#A

// HTML structured clone algorithm does not perform a full clone, so need to rehydrate a new block object from passed-in blockData
const block = new Block(blockData.index, blockData.previousHash, blockData.data, blockData.difficulty)

proofOfWork(block)

parentPort.postMessage(block) //#B