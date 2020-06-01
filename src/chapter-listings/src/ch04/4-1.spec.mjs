import {
  compose,
  curry,
  filter,
  flatMap,
  map,
  not,
  prop,
  reduce
} from '@joj/blockchain/util/fp/combinators.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import Transaction from '@joj/blockchain/domain/Transaction.js'
import chai from 'chai'

const { assert } = chai

describe('4.1 - What is functional programming, exactly?', () => {
  it('Demonstrates using higher-order functions', () => {
    // Some dummy data for illustration purposes
    const b1 = {
      isGenesis: () => true,
      isValid: () => true
    }

    const b2 = {
      isGenesis: () => false,
      isValid: () => true
    }

    const b3 = {
      isGenesis: () => false,
      isValid: () => true
    }

    // Actual snippet of code used in text
    const result = [b1, b2, b3]
      .filter(b => !b.isGenesis()) //#A
      .map(b => b.isValid()) //#B
      .reduce((a, b) => a && b, true) //#C
    assert.deepEqual(result, true)
  })
  it('4.1.2 - Shows why Array.sort is impure', () => {
    const a = [1, 30, 4, 21]
    const b = a.sort() // [1, 21, 30, 4] //#A
    assert.deepEqual(b, [1, 21, 30, 4])
    assert.deepEqual(a, [1, 21, 30, 4])
  })
})

describe('4.1.2 - Convert imperative to functional', () => {
  let ledger = null

  beforeEach(() => {
    ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test')
    const tx2 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test2')
    ledger.addPendingTransactions(tx1, tx2)
    ledger.newBlock().next()
  })

  it('Imperative', () => {
    function computeBalance(address) {
      let balance = Money.zero()
      for (const block of ledger) {
        if (!block.isGenesis()) {
          for (const tx of block.data) {
            if (tx.sender === address) {
              balance = balance.minus(tx.funds)
            } else {
              balance = balance.plus(tx.funds)
            }
          }
        }
      }
      return balance.round()
    }

    assert.ok(computeBalance('sender123').equals((-20).btc()))
    assert.ok(computeBalance('recipient123').equals((20).btc()))
  })

  it('Functional', () => {
    const balanceOf = curry((addr, tx) =>
      Money.sum(
        tx.recipient === addr ? tx.funds : Money.zero(),
        tx.sender === addr ? tx.funds.asNegative() : Money.zero()
      )
    )

    const computeBalance = address =>
      compose(
        Money.round,
        reduce(Money.sum, Money.zero()),
        map(balanceOf(address)),
        flatMap(prop('data')),
        filter(
          compose(
            not,
            prop('isGenesis')
          )
        ),
        Array.from
      )

    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).btc()))
    assert.ok(computeBalance('recipient123')([...ledger]).equals((20).btc()))
  })
})
