import { main } from '../main.js'

// invalid
// console.log(main('(+2 3)')) // operator is not a function
// console.log(main('(+ 2 3')) // Invalid expression, close brace missing
// console.log(main('(+ 2 (+ 2 4)))')) // Invalid expression, please provide valid expression
// console.log(main('(+ 2 (* 2 4) + 3)')) // Invalid indentifier doubt
// console.log(main('(+ 2 (+ 2 4 (*2 2)) (+ 3) 1)')) // operator is not a function

// string
// console.log(main('"a"'))
// console.log(main('"xyz"'))

// console.log(main('+0abc')) // null
// console.log(main('(sqrt)')) // invalid
// console.log(main('9r66')) // null
