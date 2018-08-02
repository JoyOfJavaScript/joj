import fs from 'fs'
import path from 'path'

const BASE = path.join(process.cwd(), '../', 'blockchain-wallets')
const Key = name => {
  const k = fs.readFileSync(path.join(BASE, name), 'utf8')
  if (!k || k.length === 0) {
    throw new Error(`Key file is empty ${name}`)
  }
  console.log('Key length is ' + k.length)
  return {
    toString: () => k,
    [Symbol.toPrimitive]: () => k
  }
}
export default Key
