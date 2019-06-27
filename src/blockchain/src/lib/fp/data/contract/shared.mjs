const implementsContract = (...contracts) => obj => {
  const impl = obj[Symbol.for('implements')]
  return contracts.every(c => impl.includes(c))
}

const getSpeciesConstructor = original =>
  original.constructor[Symbol.species] || original.constructor

export { implementsContract }
export { getSpeciesConstructor }
