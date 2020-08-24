import Block from '@joj/blockchain/domain/Block.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import chai from 'chai'
import reactivize from './reactivize.mjs'
import 'core-js/modules/esnext.observable.js';

const { assert } = chai

describe('9.4.9 - Dynamic steamification', () => {
  it('Creates a Reactive Array', done => {
    const square = num => {
      console.log('Squaring:', num)
      return num ** 2
    }
    const isEven = num => {
      console.log('Is even:', num)
      return num % 2 === 0
    }
    let count = 0
    const arr$ = reactivize([1, 2, 3, 4, 5])
    const subs = Observable.from(arr$)
      .filter(isEven)
      .map(square)
      .subscribe({
        next(value) {
          console.log('Received new value', value)
          count += value
        }
      })

    assert.equal(count, 20)
    arr$.push(6)
    assert.equal(count, 56)
    subs.unsubscribe()
    done()
  }).timeout(10_000)

  it('Creates a Reactive Blockchain', done => {
    let count = 0;
    const chain = new Blockchain();
    const chain$ = reactivize(chain);
    const subs = Observable.from(chain$)
      .subscribe({
        next(block) {
          console.log('Reactive chain: Received block', block.hash)
          if (block.validate().isSuccess) {
            console.log('Block is valid')
          }
          else {
            console.log('Block is invalid')
          }
          count++
        }
      });

    setTimeout(() => {
      console.log('Pushing 1');
      console.log('Top is', chain$.top.hash)
      chain$.push(new Block(1, chain$.top.hash, [])) // push a second block
      console.log('Top is', chain$.top.hash)
      console.log('Pushing 2');
      chain$.push(new Block(-1, chain$.top.hash, [])) // push a third block (invalid)
      console.log('Asserting height');
      assert.equal(chain.height() - 1, 2)
      setTimeout(() => {
        subs.unsubscribe()
        assert.equal(3, count); // genesis + 2 additional blocks
        done()
      }, 8_000)
    }, 2000)
  }).timeout(20_000)
})