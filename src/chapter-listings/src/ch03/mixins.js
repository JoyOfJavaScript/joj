import { assert } from 'chai'

describe('Mixins', () => {
  it('Should create an amphibian object', () => {
    const TerrestrialAnimal = {
      breath () {
        return 'Using my longs to breath'
      }
    }

    const AquaticAnimal = {
      breath () {
        return 'Using my gills to breath'
      }
    }

    const Amphibian = Object.assign(
      { name: 'Frog' },
      TerrestrialAnimal,
      AquaticAnimal
    )

    assert.equal(Amphibian.name, 'Frog')
    assert.equal(Amphibian.breath(), 'Using my gills to breath') // Later sources override earlier ones

    const Amphibian2 = Object.assign(
      { name: 'Frog' },
      AquaticAnimal,
      TerrestrialAnimal
    )
    assert.equal(Amphibian2.breath(), 'Using my longs to breath') // Later sources override earlier ones
  })
})
