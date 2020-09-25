
import { identity } from '@joj/blockchain/util/fp/combinators.js'
import chai from 'chai'

const { assert } = chai

function dateFormat(date) {
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
}

describe('7.7 - Method decorators', () => {
  it('Validation decorator', () => {

    const decorate = (decorator, obj) => new Proxy(obj, {
      get(target, key) {
        if (!decorator.methods.includes(key)) {
          return Reflect.get(...arguments);
        }
        const methodRef = target[key];  //#A
        return (...capturedArgs) => {  //#B
          const newArgs =  //#C
            decorator.actions ?.before.call(target, ...capturedArgs);
          const result = methodRef.call(target, ...[newArgs]); //#D
          return decorator.actions ?.after.call(target, result) ;//#E
        };
      }
    })


    const { isFinite, isInteger } = Number

    const checkLimit = (value = 1) => (isFinite(value) && isInteger(value) && value >= 0) ? value : throw new RangeError('Expected a positive number')

    // const decorator = {
    //   actions: {
    //     before: [function],
    //     after: [functin]
    //   },
    //   methods: [],
    // }

    const validation = {
      actions: {
        before: checkLimit,
        after: identity
      },
      methods: ['inc', 'dec']
    }

    const _count = Symbol('count')
    class Counter {
      constructor(count) {
        this[_count] = count;
      }
      inc(by = 1) {
        return this[_count] += by
      }
      dec(by = 1) {
        return this[_count] -= by
      }
    }


    const counter$Proxy = decorate(validation, new Counter(3));
    assert.equal(counter$Proxy.inc(), 4)
    assert.equal(counter$Proxy.dec(), 3)
    assert.equal(counter$Proxy.dec(), 2)
    assert.equal(counter$Proxy.dec(), 1)
    assert.equal(counter$Proxy.dec(), 0)
    assert.equal(counter$Proxy.dec(), -1)
    assert.equal(counter$Proxy.inc(3), 2)

    assert.throws(() => {
      assert.equal(counter$Proxy.inc(-3), -1)
    }, RangeError)

    assert.throws(() => {
      assert.equal(counter$Proxy.dec(-4), 2)
    }, RangeError)
  })
})
