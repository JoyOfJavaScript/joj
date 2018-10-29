import { curry } from '../../../adt/dist/combinators'

// Handlers
const accessorLogHandler = {
  get (target, key) {
    console.log(`${new Date()} [TRACE] Calling: `, key)
    return Reflect.get(target, key)
  }
}

const methodCountHandler = names => ({
  get (target, key) {
    if (names.includes(key)) {
      if (!target[key].invocations) {
        target[key].invocations = 0
      }
      target[key].invocations += 1
    }
    return Reflect.get(target, key)
  }
})

const weave = curry((handler, target) => {
  return new Proxy(target, handler)
})

// Module
export const TraceLog = weave(accessorLogHandler)
export const MethodCounter = (...names) => weave(methodCountHandler(names))
