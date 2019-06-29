import chai from 'chai'

const { assert } = chai

const util = {
  dotNetEmailValidator(email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.net)+$/.test(email)) {
      throw new Error(`Invalid argument error. Must provide valid .net email: ${email}`)
    }
    return email
  },
  emailValidator(email) {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      throw new Error(`Invalid argument error. Must provide valid email: ${email}`)
    }
    return email
  },
  nameValidator(name) {
    if (!name || name.length === 0) {
      throw new Error(`Invalid argument error. Must provide valid name to the transaction`)
    }
    return name
  }
}

describe('3.3 - Functional Mixins', () => {
  it('3.3.2 - Assignment vs definition', () => {
    const Transaction = {
      sender: 'luis@joj.com'
    }
    assert.deepEqual(Object.assign(Transaction, { sender: 'luke@joj.com' }), {
      sender: 'luke@joj.com'
    })

    const Transaction2 = {
      _sender: 'luis@joj.com',
      get sender() {
        return this._sender
      },
      set sender(newEmail) {
        this._sender = util.emailValidator(newEmail)
      }
    }

    assert.throws(() => {
      Object.assign(Transaction2, { sender: 'invalid@email' })
    }, Error)
  })
})
