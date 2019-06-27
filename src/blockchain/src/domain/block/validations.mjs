import { Failure, Success } from '@lib/fp/data/validation2/validation.mjs'
import { curry } from '@lib/fp/combinators.mjs'

export const checkDifficulty = block =>
  block.hash.substring(0, block.difficulty) === '0'.repeat(block.difficulty)
    ? Success.of(block)
    : Failure.of(`Hash ${block.hash} does not meet the difficulty of ${block.difficulty}`)

export const checkLinkage = curry((previousBlockHash, block) =>
  previousBlockHash === block.previousHash ? Success.of(block) : Failure.of(`Block chain broken`)
)

export const checkGenesis = block => (block.isGenesis() ? Success.of(block) : Failure.of(''))

export const checkIndex = curry((previousBlockIndex, block) =>
  previousBlockIndex < block.index
    ? Success.of(block)
    : Failure.of(`Block out of order [previous (${previousBlockIndex}) next (${block.index})]`)
)

export const dummy = () => Success.of('Dummy') // This export is tree-shaked when using either Webpack or Uglify-JS
