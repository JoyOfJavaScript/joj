import { expect } from 'chai'
import BlockHeader from '../src/model/BlockHeader'

describe('BlockHeader', () => {
  it('Test basic properties of BlockHeader', () => {
    var bh = new BlockHeader()
    expect(bh + '').to.have.string('[BlockHeader]')
  })
})
