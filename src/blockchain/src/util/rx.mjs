import 'core-js/features/observable/index.js'
import { Readable } from 'stream'
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

if (!Observable.fromGenerator || typeof Observable.fromGenerator !== 'function') {
    // Must be:
    // - writable: false
    // - enumerable: false
    // - configurable: false
    Object.defineProperty(Observable, 'fromGenerator', {
        value(generator) {
            return new Observable(observer => {
                Readable
                    .from(generator)
                    .on('data', :: observer.next)
                    .on('end',  :: observer.complete)
            })
        },
        enumerable: false,
        writable: false,
        configurable: false
    })
}

export const throttle = curry((limit, stream) => {
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
            complete() {
                observer.complete()
            }
        })
        return () => subs.unsubscribe()
    })
})

export const map = curry(
    (fn, stream) =>
        new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    observer.next(fn(value))
                },
                error(e) {
                    observer.error(e)
                },
                complete() {
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
)

export const filter = curry(
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
                complete() {
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
)


export const buffer = curry(
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
                complete() {
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
    }
)

export const skip = curry(
    (count, stream) => {
        let skipped = 0
        return new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    if (skipped++ >= count) {
                        observer.next(value)
                    }
                },
                error(e) {
                    observer.error(e)
                },
                complete() {
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
    }
)

export const reduce = curry(
    (accumulator, initialValue, stream) => {
        let result = initialValue ?? {}
        return new Observable(observer => {
            const subs = stream.subscribe({
                next(value) {
                    result = accumulator(result, value)
                },
                error(e) {
                    observer.error(e)
                },
                complete() {
                    observer.next(result)
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
    }
)

export const mapTo = curry(
    (value, stream) => {
        return new Observable(observer => {
            const subs = stream.subscribe({
                next() {
                    observer.next(value)
                },
                error(e) {
                    observer.error(e)
                },
                complete() {
                    observer.complete()
                }
            })
            return () => subs.unsubscribe()
        })
    }
)


export const ReactiveExtensions = {
    filter(predicate) {
        return filter(predicate, this)
    },
    map(fn) {
        return map(fn, this)
    },
    buffer(count) {
        return buffer(count, this)
    },
    skip(count) {
        return skip(count, this)
    },
    reduce(accumulator, initialValue = {}) {
        return reduce(accumulator, initialValue, this)
    },
    mapTo(value) {
        return mapTo(value, this)
    },
    throttle(limit) {
        return throttle(limit, this)
    }
}


// Extend native Observable object
Object.assign(Observable.prototype, ReactiveExtensions);

