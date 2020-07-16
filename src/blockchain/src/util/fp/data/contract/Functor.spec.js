//* @see https://github.com/fantasyland/fantasy-land#functor

import Functor from './Functor.js'
import chai from 'chai'

const { assert } = chai

describe('Functor', () => {
    it('Should bind to any container with a get', () => {
        class Container {
            #value;
            constructor(value) {
                this.#value = value;
            }

            get() {
                return this.#value;
            }

            static of(value) {
                return new Container(value);
            }
        }
        Object.assign(
            Container.prototype,
            Functor
        )

        assert.equal(new Container('HELLO').map(v => v.toLowerCase()).get(), 'hello');

        const { map } = Functor;

        // Using bind operator
        assert.equal((new Container('HELLO')):: map(v => v.toLowerCase()).get(), 'hello');
    })
})