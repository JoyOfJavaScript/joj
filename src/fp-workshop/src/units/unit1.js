/**
 * Unit 1 JavaScript ES6/ES7 Essentials
 *
 * @author Luis Atencio
 */
import { print } from './util'
console.log('--------------Beginning of unit 1--------------')

// Arrow functions
const identity = x => x
print('Identity of "a"', identity('a'))

// Multiline arrow function
const decide = condition => {
  if (condition === 'left') {
    return 'Turn left!'
  } else {
    return 'Turn right!'
  }
}
print('Where to turn?', decide('left'))

// Exercise 1.1
// Transform function 'decide' to using a single arrow function
const decide2 = condition => (condition === 'left' ? 'Turn left' : 'Turn right')
print('Decide', decide2('left'))

// Exercise 1.2
// Use arrow functions with map, reduce, filter
// Select only the odd numbers, square each number, then add them all up
const arr = [1, 2, 3] // Final result should be 10
const result = arr
  .filter(x => x % 2 === 1)
  .map(x => x ** 2)
  .reduce((a, b) => a + b)
print('Exercise 1.2 result (10)', result)

// Assignment destructuring: Arrays
const [a, b, ...rest] = [10, 20, 30, 40, 50]
print('Rest assignment', rest)

const { name, middle = 'J', lastname } = { name: 'Luis', lastname: 'Atencio' }
print('Full name', `${name} ${middle} ${lastname}`)

// Spread syntax
function sum(x, y, z) {
  return x + y + z
}
const numbers = [1, 2, 3]
print('Summing 1,2,3', sum(...numbers))

// Variable-length arguments
function allValid(...args) {
  return args.every(x => x !== null)
}

print('All valid?', allValid(1, 2, 3))
print('All valid?', allValid(1, 2, null, 3))
console.log('--------------End of unit 1--------------')
