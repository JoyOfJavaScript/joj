const ChangeProxy = (object, onChange) => {
  const handler = {
    set: function(target, property, value, receiver) {
      console.log(
        'setting ' + property + ' for ' + target + ' with value ' + value
      )
      target[property] = value
      onChange(target)
      // you have to return true to accept the changes
      return true
    },
  }
  return new Proxy(object, handler)
}

export default ChangeProxy
