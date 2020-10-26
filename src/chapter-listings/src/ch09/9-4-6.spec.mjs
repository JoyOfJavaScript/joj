import './rx.mjs'
import { compose, curry, prop } from '@joj/blockchain/util/fp/combinators.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Block from '@joj/blockchain/domain/Block.js'
import Builders from '@joj/blockchain/domain.js'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const fsp = fs.promises
const { assert } = chai
const { Block: BlockBuilder } = Builders
const { at, linkedTo, withPendingTransactions, withDifficulty, build: buildBlock } = BlockBuilder
const tokenize = curry((delimeter, str) => (str || '').split(delimeter))

async function* generateBlocksFromFile(file) {
  try {
    await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)

    const dataStream = fs.createReadStream(file,
      { encoding: 'utf8', highWaterMark: 64 }) //1024

    let previousDecodedData = ''

    for await (const chunk of dataStream) {
      previousDecodedData += chunk
      let separatorIndex
      while ((separatorIndex = previousDecodedData.indexOf(';')) >= 0) {
        // line includes the ;
        const decodedData = previousDecodedData.slice(0, separatorIndex + 1)

        // count blocks in row
        const blocks = tokenize(';', decodedData).filter(str => str.length > 0).map(str => str.replace(';', ''))
        // yield blocks (there might be more than one)
        for (const block of blocks) {
          yield JSON.parse(block)
        }
        previousDecodedData = previousDecodedData.slice(separatorIndex + 1)
      }
    }
    if (previousDecodedData.length > 0) {
      console.log('Parsing block', previousDecodedData)
      yield JSON.parse(previousDecodedData)
    }
  }
  catch (e) { //#D
    console.error(`Error processing file: ${e.message}`)
    throw e
  }
}


describe('9.4.6 - Representing push streams using generators', () => {
  it('Listing 9.5 Construct observables from a generator', done => {
    function* words() {
      yield 'The'
      yield 'Joy'
      yield 'of'
      yield 'JavaScript'
      yield 'From Generator'
    }
    let count = 0
    Observable.fromGenerator(words())
      .subscribe({
        next: (word) => {
          assert.isNotEmpty(word)
          count++
        },
        complete: () => {
          assert.equal(count, 5)
          done()
        }
      })
  })

  it('Listing 9.6 Validate a stream of blocks using observables', done => {
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')

    const chain = new Blockchain()
    const validateBlock = block => block.validate()
    const isSuccess = validation => validation.isSuccess;
    const boolToInt = bool => bool ? 1 : 0;
    const add = (x, y) => x + y

    const addBlockToChain = curry((chain, blockData) => {
      const block = new Block(
        blockData.index,
        chain.top.hash, blockData.data, blockData.difficulty
      )
      return chain.push(block)
    })

    const validBlocks$ = Observable.fromGenerator(generateBlocksFromFile(filename))
      .skip(1)
      .map(addBlockToChain(chain))
      .map(validateBlock)
      .filter(prop('isSuccess'))
      .map(compose(boolToInt, isSuccess))
      .reduce(add, 0)

    validBlocks$.subscribe({
      next(validBlocks) {
        assert.equal(validBlocks, 2)
        console.log('Valid blocks: ', validBlocks)
        if (validBlocks === chain.height() - 1) {
          console.log('All blocks are valid!')
        }
      },
      error(error) {
        console.log(error)
      },
      complete() {
        console.log('Done validating block stream!')
        done()
      }
    })
  }).timeout(10000);

  it('Shows error case in observer', () => {
    const toUpper = word => word.toUpperCase()

    function* words() {
      yield 'The'
      yield 'Joy'
      yield 'of'
      yield 42
    }

    Observable.fromGenerator(words())
      .map(toUpper)
      .subscribe({
        next: :: console.log,
        error: ({ message }) => { assert.equal('word.toUpperCase is not a function', message) }
      })
  })

  it('Using map with compose', done => {
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')

    const chain = new Blockchain()
    const validateBlock = block => block.validate()
    const validationToNumber = validation => Number(validation.isSuccess)
    const add = (x, y) => x + y

    const addBlockToChain = curry((chain, blockData) => {
      const block = new Block(
        blockData.index,
        chain.top.hash, blockData.data, blockData.difficulty
      )
      return chain.push(block)
    })

    Observable.fromGenerator(generateBlocksFromFile(filename))
      .skip(1)
      .map(compose(validateBlock, addBlockToChain(chain)))
      .filter(prop('isSuccess'))
      .map(validationToNumber)
      .reduce(add, 0)
      .subscribe({
        next(validBlocks) {
          assert.equal(validBlocks, 2)
          console.log('Valid blocks: ', validBlocks)
          if (validBlocks === chain.height() - 1) {
            console.log('All blocks are valid!')
          }
        },
        error(error) {
          console.log(error)
        },
        complete() {
          console.log('Done validating block stream!')
          done()
        }
      })
  }).timeout(10000);
})