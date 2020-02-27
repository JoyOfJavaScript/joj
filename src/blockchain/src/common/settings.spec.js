import chai from 'chai'

const { assert } = chai

describe('Dynamically import settings', () => {
  it('Should dynamically read out MINING_REWARD from settings', async () => {
    const { MINING_REWARD } = await import('./settings.js')
    assert.equal(MINING_REWARD.amount, 12.5)
  })
})
