import { main } from './lispParseEval.js'

// lamda
console.log(main('(begin ((lambda (x) (+ x x)) 5))') === 10)
console.log(typeof (main('(begin (lambda (x) (+ x x)))')) === 'function')
main('(begin (define x 4))')
console.log(main('(begin ((lambda (y) (+ y x)) 5))') === 9)

// main('(begin (define twice (lambda (x) (* 2 x))))')
// console.log(main('(begin (twice 5))') === 10) // error handling
// main('(begin (define repeat (lambda (f) (lambda (x) (f (f x))))))')
// console.log(main('(begin ((repeat twice) 10))') === 40)

// console.log(main('(begin (pow 2 16))') === 65536)

// main('(begin (define circle-area (lambda (r) (* pi (* r r)))))')
// console.log(main('(begin (circle-area 3))') === 28.274333882308138)

// main('(begin (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1)))))))')
// console.log(main('(begin (fact 10))') === 3628800)
// console.log(main('(begin (fact 100))') === 9.33262154439441e+157)

// main('(begin (define circle-area (lambda (r) (* pi (* r r)))))')
// main('(begin (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1)))))))')
// console.log(main('(begin (circle-area (fact 10)))') === 41369087205782.695)

// if
// console.log(main('(begin (if (= 12 12) (+ 78 2) 9))') === 80)
// console.log(main('(begin (if #f 1 0))') === 0)
// console.log(main('(begin (if #t 1 (define x 5)))') === 1)
// console.log(main('(begin (+ 2 3 (if (> 3 2) 3 2) (+ 01 222)))') === 231)

// set!
// main('(begin (set! r 10))')
// console.log('test set!!>>>>>>>>', main('(begin (+ r r))') === 20)

// quote
// console.log(main('\'(+ 1 2)'))
// console.log(main('\'#(a b c)'))
// console.log(main('\'\'a'))
// console.log(main('(begin (quote a))'))
// console.log(main('(begin (quote (+ 1 2)))'))

// begin
// console.log(main('(begin (begin 9 66))'))
// console.log(main('(begin (begin (define r 10) (* pi (* r r))))') === 314.1592653589793)
// console.log(main('(begin (begin (define r 10) (+ 1 2(* 2 (* r r)))))') === 203)

// define
// console.log(main('(begin (define r 10))'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>>', main('(begin r)') === 10)

// console.log(main('(begin (define a (+ 1 2 3)))'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>> a ', main('(begin a)') === 6)

// console.log(main('(begin (define x (+ 2 10 (* pi 2))))'))
// console.log('>>>>>', main('(begin x)') === 18.283185307179586)

// main('(begin (define define 1))')
// console.log('>>>>>', main('(begin define)') === 1)

// main('(begin (define r 1))')
// console.log(main('(begin (+ r r))') === 2)

// console.log(main('(begin (define r 10))'))
// console.log(main('(begin 9r66)'))

// expression
// console.log(main('(begin (+ 2 3 2 3))') === 10)
// console.log(main('(begin (+2 3))')) // invalid expression
// console.log(main('(begin (+ 2 3)')) // invalid expression
// console.log(main('(begin (+ 2 (+ 2 4)))') === 8)
// console.log(main('(begin (+ 2 (+ 2 4))))')) // invalid expression
// console.log(main('(begin (+ 2 4 1 9 -1 1.2))') === 16.2)
// console.log(main('(begin (+ 2  4  1  9))') === 16)
// console.log(main('(begin (+ 2 (* 2 4) + 3))')) // invalid expression, identifier
// console.log(main('(begin (+ 2 (+ 2 4 (* 2 2)) (+ 3) 1))') === 16)
// console.log(main('(begin (+ 3 3 (+ 1 (/ 2 2))  5))') === 13)
// console.log(main('(begin (+ 2 (+ 2 4 (*2 2)) (+ 3) 1))')) // invalid expression

// numbers
// console.log(main('(begin +23)'))
// console.log(main('(begin -2.2)'))
// console.log(main('(begin 2)'))
// console.log(main('(begin +0)'))
// console.log(main('(begin (sqrt))')) // invalid expression
// console.log(main('(begin (sqrt 16))') === 4)

// string
// console.log(main('"a"'))
// console.log(main('"xyz"'))

// invalid
// console.log(main('+0abc'))

// symbols
// console.log(main('(begin #t)'))
// console.log(main('(begin #f)'))
// console.log(main('(begin pi)'))
// console.log(main('(begin -)'))
// console.log(main('(begin <=)'))
// console.log(main('(begin lamda)')) // undefined
// console.log(main('(begin the-word-recursion-has-many-meanings)')) // undefined

// list
// console.log(main('(list 1 2 3 4)'))
// console.log(main('(quote ("this" "is" "a" "list"))'))
// console.log(main('(define a (list 1 2 3 4))'))
// console.log('<<<<<<<<<< a >>>>>>>>>>>', main('a'))
