import BlockHeader from './BlockHeader'

const TransactionalBlock = Object.create(BlockHeader)

TransactionalBlock.init = function(previousHash, pendingTransactions) {
  this.init(previousHash)
  this.pendingTransactions = pendingTransactions
}

export default TransactionalBlock
// https://gist.github.com/getify/5572383
// https://gist.github.com/getify/d0cdddfa4673657a9941
// https://stackoverflow.com/questions/29788181/kyle-simpsons-oloo-pattern-vs-prototype-design-pattern
// I believe through this practice the key takeaway is Behavior Delegation of objects linking to other objects.
