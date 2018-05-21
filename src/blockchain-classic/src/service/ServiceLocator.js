export default class ServiceLocator {
  repository
  static locator

  constructor(repositoryStore) {
    this.repository = repositoryStore || new Map()
  }

  static instance() {
    if (!this.locator) {
      this.locator = new ServiceLocator()
    }
    return this.locator
  }

  load(serviceName) {
    if (this.repository.has(serviceName)) {
      return this.repository.get(serviceName)
    }
    throw new Error(
      `Service ${serviceName} not found in Service Locator. You must bind service first`
    )
  }

  register(clazz, type = 'getter') {
    // Note: minification/uglification of the code will break this method
    const [, service, ...deps] = clazz
      .toString()
      .match(/^function\s*([^(]*)\(\s*([^)]*)\)/m)

    const [first, ...rest] = service
    const serviceName = first.toLowerCase() + rest.join('')

    let newInstance = null
    switch (type) {
      case 'constructor':
        newInstance = _prepareConstructorInjection(this.repository, clazz, deps)
        break
      case 'getter':
        newInstance = _prepareGetterInjection(this.repository, clazz)
        break
      default:
        throw new Error(`Unsupported service preparation strategy: ${type}`)
    }
    this.repository.set(serviceName, newInstance)
    return newInstance
  }
}

//------------------------------------------------------------------------------------//
//                      Private helper functions                                      //
//------------------------------------------------------------------------------------//
function _prepareGetterInjection(repository, clazz) {
  return new Proxy(Reflect.construct(clazz, [], clazz), {
    get(target, key) {
      if (repository.has(key)) {
        return repository.get(key)
      }
      return target[key]
    },
  })
}

function _prepareConstructorInjection(repository, clazz, deps = []) {
  return Reflect.construct(
    clazz,
    deps.filter(dep => !!dep && dep.length > 0).map(dep => {
      if (!repository.has(dep)) {
        throw new Error(
          `Dependency not found in service locator: ${dep}. Make sure you're adding dependencies in the right order`
        )
      }
      return repository[dep]
    }),
    clazz
  )
}
