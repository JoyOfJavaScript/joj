require('@babel/register')({
  extensions: ['.js', '.es6'],
})

//TODO: Don't think I need to polyfill with Babel7 and Node10
require('babel-polyfill')
