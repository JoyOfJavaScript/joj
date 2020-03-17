import 'core-js/features/observable/index.js'
import { curry } from './fp/combinators.js'

export const listen$ = curry((eventName, element) => {
    return new Observable(observer => {
        // Create an event handler which sends data to the sink
        const handler = event => observer.next(event)

        // Attach the event handler
        element.addEventListener(eventName, handler, true)

        // Return a cleanup function which will cancel the event stream
        return _ => element.removeEventListener(eventName, handler, true)
    })
})

export const throttle$ = curry((limit, stream) => {
    let lastRan = 0
    let lastInterval = 0
    return new Observable(observer => {
        const subs = stream.subscribe({
            next(value) {
                if (!lastRan) {
                    observer.next(value)
                    lastRan = Date.now()
                } else {
                    clearTimeout(lastInterval)
                    lastInterval = setTimeout(() => {
                        if (Date.now() - lastRan >= limit) {
                            observer.next(value)
                            lastRan = Date.now()
                        }
                    }, limit - (Date.now() - lastRan))
                }
            },
            error(e) {
                observer.error(e)
            },
            complete(a) {
                observer.complete(a)
            }
        })
        return _ => subs.unsubscribe()
    })
})

export const map$ = curry(
    (fn, stream) =>
        new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    observer.next(fn(value))
                },
                error(e) {
                    observer.error(e)
                },
                complete(a) {
                    observer.complete(a)
                }
            })
            return _ => subs.unsubscribe()
        })
)

export const filter$ = curry(
    (predicate, stream) =>
        new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    if (predicate(value)) {
                        observer.next(value)
                    }
                },
                error(e) {
                    observer.error(e)
                },
                complete(a) {
                    observer.complete(a)
                }
            })
            return _ => subs.unsubscribe()
        })
)


export const buffer$ = curry(
    (count, stream) => {
        const _internalStorage = []
        return new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    _internalStorage.push(value)
                    if (_internalStorage.length >= count) {
                        // emit as array                        
                        observer.next(_internalStorage)
                        _internalStorage.length = 0 // clear
                    }
                },
                error(e) {
                    observer.error(e)
                },
                complete(a) {
                    observer.complete(a)
                }
            })
            return _ => subs.unsubscribe()
        })
    }
)

Observable.fromAsyncGenerator = function (asyncGenerator) {
    return new Observable(observer => {
        (async () => {
            for await (const element of asyncGenerator) {  // <-- called a scheduler
                observer.next(element)
            }
            observer.complete();
        })()
    })
}

// Extend native Observable object
Observable.prototype.filter = function (predicate) {
    return filter$(predicate, this)
}

Observable.prototype.map = function (fn) {
    return map$(fn, this)
}

Observable.prototype.buffer = function (count) {
    return buffer$(count, this)
}
