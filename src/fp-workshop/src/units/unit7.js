/**
 * Unit 7 Natural Transformations
 *
 * @author Luis Atencio
 */
import https from 'https'

console.log('-------Beginning of unit 7-------')
import { Combinators, Maybe, Validation } from '../adt'
const { Success, Failure } = Validation
const { Just, Nothing } = Maybe
const { compose, curry } = Combinators

//
// ARRAY => MAYBE
// safeHead will retrieve the first element of an array if it exists (Just);
// otherwise, it returns Nothing
//
const safeHead = ([h]) => Maybe.fromNullable(h)
console.log('Head of [1,2,3]', safeHead([1, 2, 3]).merge())
console.log('Is head of empty array nothing?', safeHead([]).isNothing())

//
// MAYBE => PROMISE
//

console.log('-------End of unit 7-------')
