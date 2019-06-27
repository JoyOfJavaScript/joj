import fs from 'fs'
import path from 'path'

const BASE = path.join(process.cwd(), '.', 'wallets')
console.log('Base is', BASE)
const Key = (name, base = BASE) => {
  try {
    const k = fs.readFileSync(path.join(base, name), 'utf8')
    if (!k || k.length === 0) {
      throw new Error(`Key file is empty ${name}`)
    }
    return {
      valueOf: () => k,
      toString: () => k,
      [Symbol.toPrimitive]: () => k
    }
  } catch (e) {
    console.log(`Unable to load key ${name}. PEM does not exist in wallets directory`)
    throw e
  }
}
export default Key

// TODO: Hash the key values and use those as addresses
