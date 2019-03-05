import { curry } from '../lib/fp/combinators'

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

// TODO: enhance it to keep an internal map with all counters instead of printing it to the screen
const perfCountHandler = names => {
  return {
    get (target, key, r) {
      if (names.includes(key)) {
        const start = process.hrtime()
        const result = Reflect.get(target, key)
        const end = process.hrtime(start)
        console.info('Execution time: %ds %dms', end[0], end[1] / 1000000)
        return result
      }
      return Reflect.get(target, key, r)
    }
  }
}

const weave = curry((handler, target) => {
  return new Proxy(target, handler)
})

// Module
export const TraceLog = weave(accessorLogHandler)
export const MethodCounter = (...names) => weave(methodCountHandler(names))
export const PerfCount = (...names) => weave(perfCountHandler(names))
