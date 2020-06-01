import chai from 'chai'

const { assert } = chai

describe('1.3.1 - No blueprints, just prototypes', () => {
    it('DedupCollection', () => {
        const Collection = {
            items: [],
            toString: function () {
                return `Collection: ${this.items.join(', ')}`
            }
        };

        const DedupCollection = Object.create(Collection)
        DedupCollection.of = function (...elements) {
            this.items.push(...(new Set(elements)))
            return this
        }

        assert.equal("Collection: 3, 10, 2, 9", DedupCollection.of(3, 10, 10, 2, 9, 3).toString())
    })
})
