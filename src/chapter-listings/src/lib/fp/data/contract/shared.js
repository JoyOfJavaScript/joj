const implementsContract = (obj, ...contracts) => {
  const impl = obj[Symbol.for('implements')]
  return contracts.every(c => impl.includes(c))
}

export { implementsContract }
