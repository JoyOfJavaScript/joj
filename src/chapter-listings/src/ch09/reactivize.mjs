
import EventEmitter from 'events'

function implementsPushProtocol(obj) {
    return obj
        && Symbol.iterator in Object(obj)
        && typeof obj['push'] === 'function'
        && typeof obj[Symbol.iterator] === 'function'
}

const ON_EVENT = 'on'
const END_EVENT = 'end'
const LOG_LABEL = `IN-STREAM`
const LOG_LABEL_INNER = `${LOG_LABEL}:push`

export const reactivize = obj => {

    implementsPushProtocol(obj) || throw new TypeError('Object does not implement a push protocol')

    const emitter = new EventEmitter()

    const pushProxy = new Proxy(obj, {
        get(...args) {
            const [target, key] = args
            if (key === 'push') {
                const pushRef = target[key]
                return (...capturedArgs) => {
                    const result = pushRef.call(target, ...capturedArgs)
                    emitter.emit(ON_EVENT, ...capturedArgs)
                    return result
                }
            }
            return Reflect.get(...args)

        }
    });
    const observable = {
        [Symbol.observable]() {
            return new Observable(observer => {
                console.group(LOG_LABEL)
                emitter.on(ON_EVENT, newValue => {
                    console.group(LOG_LABEL_INNER)
                    console.log('Emitting new value: ', newValue)
                    observer.next(newValue)
                    console.groupEnd(LOG_LABEL_INNER)
                })
                emitter.on(END_EVENT, () => {
                    observer.complete()
                })
                for (const value of obj) {
                    observer.next(value)
                }
                return () => {
                    console.groupEnd(LOG_LABEL)
                    emitter.removeAllListeners(ON_EVENT, END_EVENT)
                }
            });
        }
    };
    return Object.assign(pushProxy, observable)
}

export default reactivize