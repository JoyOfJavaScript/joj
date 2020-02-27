import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import chai from 'chai'
import { isFunction, prop } from '@joj/blockchain/util/fp/combinators.js'
import { exec } from 'child_process';

const { assert } = chai

describe('7.5 - Well-known symbols', () => {
  it('7.5.3 Symbol.species', () => {
    class Array1 extends Array {

    }

    const a = new Array1(1, 2, 3);
    const mapped = a.map(x => x * x);

    assert.ok(mapped instanceof Array1)
    assert.ok(mapped instanceof Array)

    class Array2 extends Array {
      static get [Symbol.species]() { return Array; }
    }

    const a2 = new Array2(1, 2, 3);
    const mapped2 = a2.map(x => x * x);

    assert.notOk(mapped2 instanceof Array2)
    assert.ok(mapped2 instanceof Array)


    class Collection extends Array {
      constructor(...elems) {
        super(...elems);
      }
      remove(index) {
        this.splice(this.indexOf(index), 1)
        return new Collection(...this)
      }
      // static get [Symbol.species]() {
      //   return Array;
      // }
    }

    const letters = new Collection()
    letters[0] = 'a'
    letters[1] = 'b'
    letters[2] = 'c'
    const result = letters.filter(l => l).map(letter => letter.toUpperCase()).remove('b')
    console.log(letters)
    console.log(result)

    class EvenNumbers extends Array {
      constructor(...nums) {
        super()
        nums.filter(n => n % 2 === 0).forEach(n => this.push(n))
      }

      static get [Symbol.species]() {
        return Array
      }

      valueOf() {
        return this.reduce((sum, num) => sum + num)
      }
    }

    const evens = new EvenNumbers(1, 2, 3, 4, 5, 6)
    assert.deepEqual(evens, [2, 4, 6])
    assert.ok(evens instanceof Array)
    assert.ok(evens instanceof EvenNumbers)
    const timesTwo = evens.map(x => x ** 2)
    assert.ok(timesTwo instanceof Array)
    assert.notOk(timesTwo instanceof EvenNumbers)
  })

  class ValidatingPromise extends Promise {

    then(onFulfilled, onRejected) {
      return super.then(this.intercept(onFulfilled), onRejected)
    }

    intercept(onFulfilled) {
      return val => {
        const result = this.validate(val).map(onFulfilled)
        if (result.isSuccess) {
          return result.get()
        }
        return result
      }
    }

    validate(input) {
      return input ? Success.of(input) : Failure.of(`Expected valid result, got: ${input}`)
    }

    static get [Symbol.species]() { return Promise }
  }

  const task = result => (new ValidatingPromise(
    (resolve) => {
      console.log('Performing task...')
      setTimeout(() => {
        console.log('Done.')
        resolve(result)
      }, 2000)
    }
  ));

  it('Validating promise', () => {
    assert.ok(task(10) instanceof Promise)
    assert.ok(task(10) instanceof ValidatingPromise)

    const run = task({
      foo: 'bar'
    })
      .then(prop('foo'))
      .then(name => name.toUpperCase())
    return run
      .then(finalResult => {
        console.log('Final result:', finalResult.toString());
        assert.ok(run instanceof Promise)
        assert.notOk(run instanceof ValidatingPromise)
        assert.equal(finalResult, 'BAR')
      });
  }).timeout(5000)

  it('Extending native promise (Failure)', () => {
    return task(null)
      .then(prop('foo'))
      .then(result => {
        console.log(result.toString())
        assert.isOk(result.isFailure)
      })
  }).timeout(5000)

  it('Delayed promise', () => {
    class DelayedPromise extends Promise {
      constructor(executor, seconds = 0) {
        super((resolve, reject) => {
          setTimeout(() => {
            executor(resolve, reject);
          }, seconds * 1000)
        })
      }

      static get [Symbol.species]() { return Promise }
    }

    console.log('Start');
    const p = new DelayedPromise((resolve) => {
      resolve(10)
    }, 3)
    return p.then(num => num ** 2)
      .then(num => num + 2)
      .then(finalResult => { assert.equal(finalResult, 102); return finalResult; })
      .then(console.log);
  }).timeout(5000)

  it('@@toPrimitive', () => {
    class EvenNumbers extends Array {
      constructor(...nums) {
        super()
        nums.filter(n => n % 2 === 0).forEach(n => this.push(n))
      }

      static get [Symbol.species]() {
        return Array
      }


      [Symbol.toPrimitive](hint) {
        switch (hint) {
          case 'string':
            return `[${this.join(', ')}]`
          case 'number':
          default:
            return this.reduce((sum, num) => sum + num)
        }
      }
    }


    const evens = new EvenNumbers(1, 2, 3, 4, 5, 6)
    assert.equal(+evens, 12)
    assert.equal(2 + evens, 14)
    assert.equal(`all evens ${evens}`, 'all evens [2, 4, 6]')

    function MyNumberType(n) {
      this.number = n;
    }

    MyNumberType.prototype.valueOf = function () {
      return this.number;
    };

    const object1 = new MyNumberType(4);

    assert.equal(object1 + 3, 7)

    function validate(input) {
      return input ? Success.of(input) : Failure.of(`Expected valid result, got: ${input}`)
    }

    assert.equal('The Joy of ' + Success.of('JavaScript'), 'The Joy of JavaScript')
    assert.equal(validate(10) + 5, 15)
    assert.throws(() => {
      validate(null) + 5, 15
    }, Error, "Can't extract the value of a Failure")
  })

  it('@@toIterator', () => {
    const Pair = (left, right) => ({
      left,
      right,
      equals: otherPair => left === otherPair.left && right === otherPair.right,
      [Symbol.toStringTag]: 'Pair',
      [Symbol.species]: () => Pair,
      [Symbol.iterator]: function* () {
        yield left
        yield right
      },
      [Symbol.toPrimitive]: hint => {
        switch (hint) {
          case 'number':
            return left + right
          case 'string':
            return `Pair [${left}, ${right}]`
          default:
            return [left, right]
        }
      },
      [Symbol.for('toJson')]: () => ({
        type: 'Pair',
        left,
        right
      })
    })
    const p = Pair(20, 30)
    const p2 = p[Symbol.species]()(20, 30)
    assert.isOk(p.equals(p2))
    assert.equal(+p, 50)
    assert.equal(p.toString(), '[object Pair]')
    assert.equal(`${p}`, 'Pair [20, 30]')
    const [left, right] = p
    assert.equal(left, 20)
    assert.equal(right, 30)
    assert.deepEqual([...p], [20, 30])
  })
})
