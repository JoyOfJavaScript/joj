import { assert } from 'chai'
import Document from '../src/svg/data/Document'

describe('Document Spec', () => {
  it('Should instantiate a new SVG Document Root (empty)', () => {
    const root = Document(500, 400)
    assert.isOk(root instanceof Document())
    assert.isEmpty(root.getChildren())
    assert.equal(root.width, 500)
    assert.equal(root.height, 400)
    assert.equal(root.getTagName(), 'svg')
    assert.equal(
      root.render(),
      `<svg  width:"500" height:"400" viewBox:"0 0 500 400" xmlns:"http://www.w3.org/2000/svg" style="">\n\n</svg>`
    )
  })
})
