import { globalSym, sym } from './7-3-otherModule.mjs'
import chai from 'chai'

const { assert } = chai

describe('7.3 - Symbol registries', () => {
  it('7.3.1 Local symbol registry', () => {

    global.sym = Symbol('In global scope')
    assert.equal(global.sym.toString(), 'Symbol(In global scope)')
    assert.equal(sym.toString(), 'Symbol(In module scope)')

    const symFoo = Symbol('foo')
    global.symFoo = Symbol('foo')
    assert.isUndefined(Symbol.keyFor(symFoo))
    assert.isUndefined(Symbol.keyFor(global.symFoo))
  })

  it('7.3.2 Global symbol registry', () => {
    const symFoo = Symbol.for('foo')
    assert.equal(Symbol.keyFor(symFoo), 'foo')
    assert.equal(Symbol.keyFor(globalSym), 'GlobalSymbol')
  })
})
