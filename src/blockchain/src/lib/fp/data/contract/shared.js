const implementsContract = (...contracts) => obj => {
  const impl = obj[Symbol.for('implements')]
  return contracts.every(c => impl.includes(c))
}

export { implementsContract }
