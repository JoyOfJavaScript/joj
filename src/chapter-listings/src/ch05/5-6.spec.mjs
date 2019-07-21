import Block from '@joj/blockchain/domain/Block.mjs'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const Monad = () => ({
  flatMap(f) {
    return this.map(f).get() // #A
  },
  chain(f) {
    //#B
    return this.flatMap(f)
  },
  bind(f) {
    //#B
    return this.flatMap(f)
  }
})

const Functor = () => ({
  map(f = identity) {
    //#A
    return this.constructor.of(f(this.get())) //#B
  }
})

class Validation {
  #val //#A
  constructor(value) {
    this.#val = value
    if (![Success.name, Failure.name].includes(new.target.name)) {
      //#B
      throw new Error(
        `Can't directly constructor a Validation. 
            Please use constructor Validation.of`
      )
    }
  }

  get() {
    //#C
    return this.#val
  }

  static of(value) {
    //#D
    return Validation.Success(value)
  }

  static Success(a) {
    return Success.of(a)
  }

  static Failure(error) {
    return Failure.of(error)
  }

  get isSuccess() {
    //#E
    return false
  }

  get isFailure() {
    //#E
    return false
  }

  equals(otherValidation) {
    //#F
    return this.#val === otherValidation.get()
  }

  getOrElse(defaultVal) {
    //#G
    return this.#val || defaultVal
  }

  toString() {
    return `${this.constructor.name} (${this.#val})`
  }
}

class Success extends Validation {
  static of(a) {
    return new Success(a)
  }

  get isSuccess() {
    return true //#A
  }
}

class Failure extends Validation {
  get isFailure() {
    //#A
    return true
  }

  static of(b) {
    return new Failure(b)
  }

  get() {
    //#B
    throw new Error(`Can't extract the value of a Failure`)
  }

  getOrElse(defaultVal) {
    //#C
    return defaultVal
  }
}

Object.assign(Validation.prototype, Functor(), Monad())

const { assert } = chai

describe('5.6 - Implementing the Validation ADT', () => {
  it('5.6.2 - Modeling success or failure', () => {
    const block = new Block(1, '123456789', ['some data'], 1)
    const checkTampering = block =>
      block.hash === block.calculateHash() ? Success.of(block) : Failure.of('Block hash is invalid')
    assert.isTrue(checkTampering(block).isSuccess)
    block.data = ['data compromised']
    assert.isTrue(checkTampering(block).isFailure)
  })

  it('Parent Validation class with Success and Failure subclasses', () => {
    const read = f =>
      fs.existsSync(f)
        ? Success.of(fs.readFileSync(f)) //#B
        : Failure.of(`File ${f} does not exist!`) //#C
    const file = path.join(process.cwd(), 'src/ch05', 'sample.txt')
    const noFile = path.join(process.cwd(), 'src/ch05', 'not-exists.txt')

    assert.isTrue(read(file).isSuccess)
    assert.isTrue(read(noFile).isFailure)

    const decode = (encoding = 'utf8') => buffer => buffer.toString(encoding)
    const count = arr => (!arr ? 0 : arr.length)

    const countBlocksInFile = f =>
      read(f)
        .map(decode('utf8'))
        .map(JSON.parse)
        .map(count)

    assert.equal(countBlocksInFile(file).get(), 3)
  })
})
