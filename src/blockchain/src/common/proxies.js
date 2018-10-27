import { curry } from '../../../adt/dist/combinators'

// Handlers
const accessorLogHandler = {
  get (target, key) {
    console.log(`${new Date()} [TRACE] Calling: `, key)
    return Reflect.get(target, key)
  }
}

const methodCountHandler = name => ({
  get (target, key) {
    if (key === name) {
      if (!target[name].invocations) {
        target[name].invocations = 0
      }
      target[name].invocations += 1
    }
    return Reflect.get(target, key)
  }
})

const weave = curry((handler, target) => {
  return new Proxy(target, handler)
})

// Module
export const TraceLog = weave(accessorLogHandler)
export const MethodCounter = name => weave(methodCountHandler(name))
