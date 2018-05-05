/**
 * Unit 1 JavaScript ES6/ES7 Essentials
 * @author Luis Atencio
 */
console.log('\x1b[36m', 'Beginning of unit 1')

// Arrow functions
const identity = x => x
console.log('Identity of "a"', identity('a'))

// Multiline arrow function
const decide = condition => {
  if (condition === 'left') {
    return 'Turn left!'
  } else {
    return 'Turn right!'
  }
}
console.log('Where to turn?', decide('left'))

// Exercise 1.1
// Transform function 'decide' to using a single arrow function
const decide2 = condition => (condition === 'left' ? 'Turn left' : 'Turn right')
console.log(decide2('left'))

// Exercise 1.2
// Use arrow functions with map, reduce, filter
// Select only the odd numbers, square each number, then add them all up
const arr = [1, 2, 3] // Final result should be 10
const result = arr
  .filter(x => x % 2 === 1)
  .map(x => x ** 2)
  .reduce((a, b) => a + b)
console.log(result)

// Assignment destructuring: Arrays
const [a, b, ...rest] = [10, 20, 30, 40, 50]
console.log(rest)

const { name, middle = 'J', lastname } = { name: 'Luis', lastname: 'Atencio' }
console.log('Full name: ', `${name} ${middle} ${lastname}`)

// Spread syntax
function sum(x, y, z) {
  return x + y + z
}
const numbers = [1, 2, 3]
console.log(sum(...numbers))

// Variable-length arguments
function allValid(...args) {
  return args.every(a => a !== null)
}

console.log('All valid?', allValid(1, 2, 3))
console.log('All valid?', allValid(1, 2, null, 3))
console.log('%s\x1b[0m', 'End of unit 1')
