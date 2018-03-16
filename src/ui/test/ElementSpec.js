import { assert } from 'chai'
import Element from '../src/svg/data/Element'

describe('Element Spec', () => {
  it('Should instantiate a new base element', () => {
    const child = Element('child')
    const parent = Element('parent', child)
    assert.isOk(child instanceof Element())
    assert.isOk(parent instanceof Element())
    assert.equal(parent.getId(), 'parent')
    assert.equal(child.getId(), 'child')
    assert.deepEqual(parent.getChildren(), [child])
    assert.isEmpty(child.getChildren())
  })
})
