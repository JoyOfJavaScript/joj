import { expect } from 'chai'
import BlockchainService from '../src/service/BlockchainService'
import BlockService from '../src/service/BlockService'
import ServiceLocator from '../src/service/ServiceLocator'

describe('Service Locator', () => {
  const serviceLocator = ServiceLocator.instance()
  it('Should register constructor dependencies into a service locator', () => {
    serviceLocator.register(BlockService, 'constructor')
    serviceLocator.register(BlockchainService, 'constructor')
    const blockService = serviceLocator.load('blockService')
    expect(blockService).to.not.be.null
    const blockChainService = serviceLocator.load('blockchainService')
    expect(blockChainService).to.not.be.null
    expect(blockChainService.blockService).to.not.be.null
  })

  it('Should register getter dependencies into a service locator', () => {
    class ServiceA {
      doSomething() {
        console.log('Calling Service A to do something')
        return 10
      }
    }

    class ServiceB {
      get serviceA() {
        return this.a
      }

      doSomething() {
        console.log('Calling Service B to do something, then ...')
        return this.serviceA.doSomething() + 10
      }
    }
    serviceLocator.register(ServiceA)
    const result = serviceLocator.register(ServiceB).doSomething()
    expect(result).to.be.equal(20)
  })

  it('Should register getter dependencies into a service locator different order', () => {
    class ServiceA {
      doSomething() {
        console.log('Calling Service A to do something')
        return 10
      }
    }

    class ServiceB {
      get serviceA() {
        return this.a
      }

      doSomething() {
        console.log('Calling Service B to do something, then ...')
        return this.serviceA.doSomething() + 10
      }
    }
    const b = serviceLocator.register(ServiceB)
    serviceLocator.register(ServiceA)
    expect(b.doSomething()).to.be.equal(20)
  })
})
