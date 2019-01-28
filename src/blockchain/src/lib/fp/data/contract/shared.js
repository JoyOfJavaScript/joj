import { curry } from 'fp/combinators'

const implementsContract = curry((contract, obj) =>
  obj[Symbol.for('implements')].includes(contract)
)

export { implementsContract }
