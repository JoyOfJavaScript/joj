/**
 * Unit 6 Monads Using the Maybe Monad for lazy, seamless null-check
 *
 * @author Luis Atencio
 */
import { print } from './util'
import { Combinators, Maybe } from '../adt'
const { map, compose, curry, flatMap } = Combinators
const { Just } = Maybe
console.log('--------------Beginning of unit 6--------------')

// Helpers
const add = curry((a, b) => a + b)
const isOdd = a => a % 2 === 1
const square = a => a ** 2
const prop = curry((name, obj) => obj[name])

//
// MAYBE.Just
//
let result = Just(10).flatMap(x => Just(x))
print('Result 1', result)

result = Just(10).flatMap(x => Just(x ** 2))
print('Result 2', result)

//
// Exercise 6.1
// Given a nested structure, with the value 10, compute the square of such number and then increment the result
//
result = Just(10).flatMap(compose(Just, add(1), square))
print('Exercise 6.1 answer (101)', result)

//
// SAFE OBJECT TRAVERSAL
//
// Given the following user object input
const user = {
  name: 'Luis',
  employer: {
    name: 'Citrix',
    address: {
      city: 'Ft. Lauderdale',
      phone: {
        area: '954',
        number: '267-3000',
      },
    },
  },
}

function getAreaCode(user) {
  if (user) {
    if (user.employer) {
      if (user.employer.address) {
        if (user.employer.address.phone) {
          return user.employer.address.phone.area
        }
      }
    }
  }
}
print('Get area code', getAreaCode(user))

//
// Fluent-design approach using Maybe
//
const areaCode = user =>
  Maybe.fromNullable(user)
    .map(prop('employer'))
    .map(prop('address'))
    .map(prop('phone'))
    .map(prop('area'))

print("Luis' area code is", areaCode(user))

//
// Exercise 6.2 Use function composition with 'prop' and 'map' helper functions to
// implemented the same logic above of areaCode
//
const areaCode2 = compose(
  map(prop('area')),
  map(prop('phone')),
  map(prop('address')),
  map(prop('employer')),
  Maybe.fromNullable
)
print('Exercise 6.2 answer (954)', areaCode2(user))

//
// Exercise 6.3 Given function fetchAddress, replace the direct prop('address') call with a call to
// fetch the address of an object
//

const directory = new Map()

directory.set('Citrix', {
  city: 'Ft. Lauderdale',
  phone: {
    area: '954',
    number: '267-3000',
  },
})
const fetchAddressInDirectory = dir => ({ name }) =>
  !dir.has(name) ? Maybe.Nothing() : Maybe.fromNullable(dir.get(name))

const fetchAddress = fetchAddressInDirectory(directory)

const areaCode3 = compose(
  map(prop('area')),
  map(prop('phone')),
  flatMap(fetchAddress),
  map(prop('employer')),
  Maybe.fromNullable
)
print('Exercise 6.3 answer (954)', areaCode3(user))

console.log('--------------End of unit 6--------------')
