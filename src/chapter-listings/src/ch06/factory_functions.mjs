import Block from '@joj/blockchain/domain/Block.mjs'
import Blockchain from '@joj/blockchain/domain/Blockchain.mjs'
import Money from '@joj/blockchain/domain/value/Money.mjs'
import { compose } from '@joj/blockchain/util/fp/combinators.mjs'

export function makeMoney(currency, amount) {
  return compose(
    Object.seal,
    Object.freeze
  )(Money(currency, amount))
}

export function makeChain() {
  const previousHash = '0'.repeat(64)
  const data = []
  const genesis = new Block(1, previousHash, data)
  return new Blockchain(genesis)
}
