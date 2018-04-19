const ChangeProxy = (object, onChange) => {
  const handler = {
    defineProperty(target, property, descriptor) {
      console.log('Proxy hit')
      onChange()
      return Reflect.defineProperty(target, property, descriptor)
    },
    deleteProperty(target, property) {
      onChange()
      return Reflect.deleteProperty(target, property)
    },
  }

  return new Proxy(object, handler)
}

export default ChangeProxy
