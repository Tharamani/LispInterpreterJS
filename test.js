import { main } from './main.js'

// lamda
// console.log(main('((lambda (x) (+ x x)) 5)') === 10)
// console.log(typeof (main('(lambda (x) (+ x x))')) === 'function')
// main('(define x 4)')
// console.log(main('((lambda (y) (+ y x)) 5)') === 9)

// main('(define twice (lambda (x) (* 2 x)))')
// console.log(main('(twice 5)') === 10)
// main('(define repeat (lambda (f) (lambda (x) (f (f x)))))')
// console.log(main('((repeat twice) 10)') === 40)

// console.log(main('(pow 2 16)') === 65536)

// main('(define circle-area (lambda (r) (* pi (* r r))))')
// console.log(main('(circle-area 3)') === 28.274333882308138)

// main('(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))')
// console.log(main('(fact 10)') === 3628800)
// console.log(main('(fact 100)') === 9.33262154439441e+157)

// main('(define circle-area (lambda (r) (* pi (* r r))))')
// main('(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))')
// console.log(main('(circle-area (fact 10))') === 41369087205782.695)

// main('(define first car)')
// console.log(main('(first (list 0 1 2 3 0 0))'))
// main('(define rest cdr)')
// console.log(main('(rest (list 0 1 2 3 0 0))'))
// main('(define count (lambda (item L) (if (not (isNull L)) (+ (if (= item (first L)) 1 0) (count item (rest L))) 0)))')
// console.log(main('(count 0 (list 0 1 2 3 0 0))') === 3)

// main('(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))')
// main('(define range (lambda (a b) (if (= a b) (quote ()) (cons a (range (+ a 1) b)))))')
// console.log(typeof main('(range 0 10)') === 'object')

// main('(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))')
// main('(define range (lambda (a b) (if (= a b) (quote ()) (cons a (range (+ a 1) b)))))')
// console.log(main('(range 0 10)'))
// console.log(main('(map fib (range 0 10))'))

// if
// console.log(main('(if (= 12 12) (+ 78 2) 9)') === 80)
// console.log(main('(if #f 1 0)') === 0)
// console.log(main('(if #t 1 (define x 5))') === 1)
// console.log(main('(+ 2 3 (if (> 3 2) 3 2) (+ 1 222))') === 231)

// set!
// main('(set! r 10)')
// console.log('test set!!>>>>>>>>', main('(+ r r)') === 20)

// quote
// console.log(main('\'(+ 1 2)') === '(+ 1 2)')
// console.log(main('\'(a b c)') === '(a b c)')
// console.log(main('(quote a)') === 'a')
// console.log(main('(quote (+ 1 2))') === '(+ 1 2)')

// begin
console.log(main('(begin 9 66)') === 66)
// console.log(main('(begin (define r 10) (* pi (* r r)))') === 314.1592653589793)
// console.log(main('(begin (define r 10) (+ 1 2(* 2 (* r r))))') === 203)

// define
// console.log(main('(define r 10)'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>>', main('r') === 10)

// console.log(main('(define a (+ 1 2 3))'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>> a ', main('a') === 6)

// console.log(main('(define x (+ 2 10 (* pi 2)))'))
// console.log('>>>>>', main('x') === 18.283185307179586)

// main('(define define 1)')
// console.log('>>>>>', main('define') === 1)

// main('(define r 1)')
// console.log(main('(+ r r)') === 2)

// console.log(main('(define r 10)'))
// console.log(main('9r66') === null) // doubt

// expression
// console.log(main('(+ 2 3 2 3)') === 10)
// console.log(main('(+2 3)')) // operator is not a function
// console.log(main('(+ 2 3')) // Invalid expression, close brace missing
// console.log(main('(+ 2 (+ 2 4))') === 8)
// console.log(main('(+ 2 (+ 2 4)))')) // Invalid expression, please provide valid expression
// console.log(main('(+ 2 4 1 9 -1 1.2)') === 16.2)
// console.log(main('(+ 2  4  1  9)') === 16)
// console.log(main('(+ 2 (* 2 4) + 3)')) // Invalid indentifier
// console.log(main('(+ 2 (+ 2 4 (* 2 2)) (+ 3) 1)') === 16)
// console.log(main('(+ 3 3 (+ 1 (/ 2 2))  5)') === 13)
// console.log(main('(+ 2 (+ 2 4 (*2 2)) (+ 3) 1)')) // operator is not a function

// numbers
// console.log(main('+23') === 23)
// console.log(main('-2.2') === -2.2)
// console.log(main('2') === 2)
// console.log(main('+0') === 0)
// console.log(main('(sqrt)')) // invalid
// console.log(main('(sqrt 16)') === 4)

// invalid
// console.log(main('+0abc')) // null

// symbols
// console.log(main('#t') === true)
// console.log(main('#f') === false)
// console.log(main('pi') === 3.141592653589793)

// doubt
// console.log(main('-'))
// console.log(main('<='))
// console.log(main('lamda') === null) // undefined
// console.log(main('the-word-recursion-has-many-meanings') === null) // undefined

// list
// console.log(typeof main('(list 1 2 3 4)') === 'object')
// console.log(main('(quote ("this" "is" "a" "list"))') === '("this" "is" "a" "list")')
// console.log(main('(define a (list 1 2 3 4))'))
// console.log('<<<<<<<<<< a >>>>>>>>>>>', typeof main('a') === 'object')
