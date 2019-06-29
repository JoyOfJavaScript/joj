import chai from 'chai'

const { assert } = chai

describe('1.3.2 - JavaScript objects: no fluff, just stuff', () => {
  it('Object literals', () => {
    const poleWeapon = {
      material: 'wood'
    }

    const spear = Object.create(poleWeapon)
    spear.name = 'Javelin'

    const weapon = Object.create(spear)
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })
  it('Object constructor', () => {
    function PoleWeapon(material) {
      this.material = material
    }

    function Spear(name) {
      PoleWeapon.call(this, 'wood')
      this.name = name
    }

    Spear.prototype = Object.create(PoleWeapon.prototype)
    Spear.prototype.constructor = Spear

    const weapon = new Spear('Javelin')
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })

  it('Classes', () => {
    class PoleWeapon {
      constructor(material) {
        this.material = material
      }
    }

    class Spear extends PoleWeapon {
      constructor(name) {
        super('wood')
        this.name = name
      }
    }

    const weapon = new Spear('Javelin')
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })

  it('Delegation', () => {
    const PoleWeapon = {
      init(material) {
        this.material = material
        return this
      }
    }

    const Spear = Object.create(PoleWeapon)
    Spear.init = function(name) {
      PoleWeapon.init.call(this, 'wood')
      this.name = name
      return this
    }

    const weapon = Object.create(Spear).init('Javelin')
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })

  it('Functional Mixins', () => {
    const PoleWeapon = {}

    const HasMaterial = material => ({
      material
    })

    const HasName = name => ({
      name
    })

    const weapon = Object.assign(PoleWeapon, HasMaterial('wood'), HasName('Javelin'))
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })
})
