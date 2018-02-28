import Block from './Block'
import { compose, curry } from 'ramda'

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
const assign = curry(Object.assign)
const TransactionalBlock = (timestamp, transactions = [], previousHash = '') =>
  compose(assign({ transactions }), Block)(timestamp, null, previousHash)

// Object.assign(
//   {
//     transactions
//   },
//
// )

export default TransactionalBlock
