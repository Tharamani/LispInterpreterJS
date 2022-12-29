const globalEnv = {
  '+': (...args) => args.reduce((acc, cv) => acc + cv, 0),
  '-': (...args) => args.reduce((acc, cv) => acc - cv),
  '*': (...args) => args.reduce((acc, cv) => acc * cv, 1),
  '/': (...args) => (args.length === 2 ? args[0] / args[1] : null),
  '>=': (...args) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val >= arr[i + 1]
    })
      .filter(val => val !== undefined)
      .every(val => val)
  },
  '<=': (...args) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val <= arr[i + 1]
    })
      .filter(val => val !== undefined)
      .every(val => val)
  },
  '=': (...args) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val === arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
  },
  '>': (...args) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val > arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
  },
  '<': (...args) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val < arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
  },
  '#t': true,
  '#f': false,
  pi: Math.PI,
  sqrt: (...args) => Math.sqrt(args[0])
}

const lfunction = ['+', '-', '*', '/', '<', '>', '>=', '<=', '=']

const stringParser = (input) => {
  console.log('stringParser', input)
  const matched = input.match(/".*"/)
  console.log('stringParser matched', matched)
  if (matched) return matched[0].trim()
  return null
}

// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^[+-]?((([1-9])(\d*))|(0))(\.\d+)?/)
  if (output) return [Number(output[0]), input.slice(output[0].length).trim()]
  return null
}

// function parser
const functionParser = (input) => {
  console.log('functionParser', input, globalEnv[input])
  if (globalEnv[input] === undefined) return null
  return [globalEnv[input], input.slice(input.length)]
  // return globalEnv[input]
}

// symbol parser
const symbolParser = (input) => {
  console.log('symbolParser', input)
  if (input.startsWith('(')) return null

  input = input.trim()
  let symbol = ''

  while (input[0] !== ' ' && input[0] && input[0] !== ')') {
    console.log('while input', input, input[0])
    symbol += input[0]
    input = input.slice(1)
  }
  console.log('symbolParser symbol, input', input, symbol, [symbol, input.slice(0)])
  return [symbol, input.slice(0)]
}

//
const expressionParser = (input) => {
  console.log('expressionParser', input)
  input = input.trim()
  // atom
  if (input[0] !== '(') {
    let atom = input.split(' ')[0]
    if (atom.endsWith(')')) atom = atom.slice(0, atom.length - 1)
    console.log('atom', atom, 'input.slice(atom.length).trim()', input.slice(atom.length).trim())
    return [atom, input.slice(atom.length).trim()]
  }
  // expression
  let expressionStr = input.slice(1) // input = (...) ) // expression = ...) )
  let count = 1
  while (count !== 0) {
    if (expressionStr[0] === '(') count++
    if (expressionStr[0] === ')') count--
    expressionStr = expressionStr.slice(1)
  }
  console.log('expressionStr', expressionStr.trim())
  console.log(input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim())
  return [input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim()]
}

// Quote eval
// (quote exp)
// (quote (+ 1 2))
// null
// [value, remaining string]
const quoteEval = (input) => {
  if (!input.startsWith('(')) return null
  input = input.slice(1).trim() // slice '('

  console.log('quoteEval', input)

  if (!input.startsWith('quote')) return null
  input = input.slice('quote'.length).trim() // slice 'quote'

  const parsed = expressionParser(input)
  console.log('quoteEval parsed', parsed)
  if (parsed === null) return null
  const value = parsed[0]
  input = parsed[1]

  if (input !== ')') return null
  return [value, input.slice(input.length)]
}

// Define eval
// syntax: (define symbol exp)
// null
// [value, remaining string]
const defineEval = (input, env) => {
  if (!input.startsWith('(define')) return null

  console.log('defineEval', input)
  input = input.slice('(define'.length) // slice '(define'

  let parsed = symbolParser(input)
  console.log('defineEval', parsed)
  if (parsed === null) return null

  const symbol = parsed[0] // symbol
  input = parsed[1]
  console.log('defineEval symbol', symbol)

  parsed = expressionEval(input)
  console.log('defineEval parsed', parsed)
  if (parsed === null) return null

  const expression = parsed[0] // value/expression
  input = parsed[1]
  console.log('defineEval expression', expression)

  console.log('defineEval input', input)
  if (input[0] !== ')') return null

  env[symbol] = expression

  console.log(`${symbol} defined`)

  return [null, input.slice(1)]
}

// if Eval
// (if testExpr conseqExpr altExpr)
// testExpr = exprParser(input)
// conseqExpr = exprParser(input)
// altExpr = exprParser(input)
// if (evalExpr(testExpr)) return evalExpr(conseqExpr)
// return evalExpr(altExpr)
// (if (> 3 4) 3 2)
// [3, remainingstring]
// [2, remainingstring]
const ifEval = (input, env) => {
  console.log('ifEval input', input)
  if (!input.startsWith('(')) return null
  input = input.slice(1).trim() // slice '('

  console.log('ifEval', input)

  if (!input.startsWith('if')) return null
  input = input.slice('if'.length).trim() // slice 'if'

  let parsed = expressionParser(input)
  console.log('ifEval parsed', parsed)

  const test = parsed[0]
  console.log('ifEval test', test)

  input = parsed[1]
  console.log('ifEval input', input)

  parsed = expressionParser(input)
  console.log('ifEval parsed', parsed)

  const consequent = parsed[0]
  console.log('ifEval consequent', consequent)

  input = parsed[1]
  console.log('ifEval input', input)

  parsed = expressionParser(input)
  console.log('ifEval parsed', parsed)

  const alternate = parsed[0]
  console.log('ifEval alternate', alternate)

  input = parsed[1]
  console.log('ifEval input', input)

  if (input[0] !== ')') return null
  input = input.slice(1)
  console.log('ifEval test eval alternate', alternate, expressionEval(test, env))
  // if (expressionEval(test, env) === false) return [expressionEval(alternate, env)[0], input.slice(1).trim()]
  if (expressionEval(test, env)[0] === false) return [expressionEval(alternate, env)[0], input.slice(1).trim()]
  console.log('ifEval test eval', expressionEval(test, env))
  return [expressionEval(consequent, env)[0], input.slice(0).trim()]
}

// syntax:  (begin <expression1> <expression2> ...)
const beginEval = (input, env) => {
  console.log('beginEval input', input)
  if (!input.startsWith('(')) return null
  input = input.slice(1).trim() // slice '('

  console.log('beginEval', input)

  if (!input.startsWith('begin')) return null
  input = input.slice('begin'.length).trim() // slice 'if'
  const arr = []
  while (input[0] !== ')') {
    const parsed = expressionParser(input)
    const exp = parsed[0]
    arr.push(exp)
    input = parsed[1]
  }
  console.log('beginEval end of', arr)
  arr.forEach(arg => {
    expressionEval(arg, env)
  })
  if (input[0] !== ')') return null
  return expressionEval(arr[arr.length - 1], env)
}

// syntax:  (lambda <formals> <body>)
const lambda = (input, env) => {
  console.log('lambda input', input)

  input = input.slice(1).trim() // slice '('

  console.log('lambda', input)

  if (!input.startsWith('lambda')) return null
  input = input.slice('lambda'.length).trim() // slice 'lambda'

  const parsed = expressionParser(input)
  console.log('lambda', parsed)
  input = parsed[1]

  const formals = parsed[0] // (args1, args2...)
  let parsedArgs = parsed[0].slice(1).trim() // args1, args2...)
  console.log('lambda formals parsedArgs', formals, parsedArgs)

  // get args
  const parameteArr = []
  while (parsedArgs[0] !== ')') {
    const parsed = expressionParser(parsedArgs)
    const exp = parsed[0]
    parameteArr.push(exp)
    parsedArgs = parsed[1]
  }

  console.log('lambda formals input', input, parameteArr)

  const parsedBody = expressionParser(input)
  console.log('lambda', parsedBody)

  const body = parsedBody[0]
  input = parsedBody[1].slice(1)

  console.log('lambda body', body, input)

  const localEnv = Object.create(env)

  function lambdaJS (...funcArgs) {
    funcArgs.forEach((arg, index) => { localEnv[parameteArr[index]] = arg })
    return expressionEval(body, localEnv)
  }
  // if (input[0] !== ')') return null
  return lambdaJS
}

// syntax:  (set! <variable> <expression>)
const setEval = (input, env) => {
  console.log('setEval input', input)
  if (!input.startsWith('(')) return null
  input = input.slice(1).trim() // slice '('

  console.log('setEval', input)

  if (!input.startsWith('set!')) return null
  input = input.slice('set!'.length).trim() // slice 'if'

  const parsed = symbolParser(input)
  console.log('setEval parsed', parsed)

  const variable = parsed[0]
  console.log('setEval variable', variable)

  input = parsed[1]
  console.log('setEval input', input)

  if (env[variable] === undefined) return null
  console.log('setEval env[variable]', env[variable])
  env[variable] = expressionEval(expressionParser(input)[0], env)[0]
  console.log('setEval env[variable]', variable, env[variable])
  console.log(`${variable} Set`)
  return [null, input.slice(1)]
}

let count = 0
// compound eval
const functionEval = (input, env) => {
  if (!input.startsWith('(')) return null
  count++

  console.log('functionEval', input)
  input = input.slice(1) // slice '('

  const parsed = expressionEval(input, env)
  if (parsed === null) return null

  const lFunction = parsed[0] // lFunction
  console.log('functionEval parsed', parsed, lFunction, parsed[1])
  if (globalEnv[lFunction] === undefined) return null
  input = parsed[1] // args in string
  const output = []

  while (input[0] !== ')' && input[0]) {
    const args = expressionEval(input, env)
    console.log('functionEval args, args[0], args[1]', args, args[0], args[1], '<<<', globalEnv[args[0]])

    if (args === null) return null
    if (lfunction.includes(args[0])) return null
    if (args[0] === 'pi' || globalEnv[args[0]]) {
      output.push(globalEnv[args[0]])
    } else {
      output.push(args[0])
    }

    input = args[1]
    console.log('functionEval input', output, input)
    // }
  }
  if (input[0] === ')') {
    input = input.slice(1)
    count--
    console.log('input[0] === close brace', count, input, output, globalEnv[lFunction](...output))

    if (globalEnv[lFunction] !== undefined) return [globalEnv[lFunction](...output), input.trim()]
  }
  console.log('count', count)
  if (count !== 0) return null
  return null
}

// null, [value, remainingstring]
const expressionEval = (input, env) => {
  console.log('expressionEval', input)
  input = input.trim()

  if (input[0] === '\'') return [input.slice(1), input.slice(input.length)]
  if (functionParser(input) === false) return false

  // return null, [value, remaining string]
  return numberParser(input) || functionParser(input, env) || symbolParser(input) || functionEval(input, env) || defineEval(input, env) || quoteEval(input) || ifEval(input, env) || setEval(input, env) || beginEval(input, env) || lambda(input, env)// || stringParser(input)
}

function main (input) {
  console.log('given input', input)
  return expressionEval(input, globalEnv)
}

// main('(define x 4)')
// console.log(main('((lambda (y) (+ y x)) 5)') === 9)
// console.log(typeof (main('(lambda (x) (+ x x))')) === 'function')
// console.log(main('((lambda (x) (+ x x)) (* 3 4))') === 24)
// console.log(main('(begin (define r 10)  (* pi (* r r)))'))
// console.log(main('(define a (+ 1 2 3 4))'))
// console.log('>>>> a', main('a'))
// main('(define r 1)')
// main('(set! r 10)')
// console.log(main('(+ r r)'))
// console.log(main('(+ 2 3 (if (> 3 2) 3 2) (+ 1 2))'))
// console.log(main('(+ (+ 2 3) + 1 2)'))
// console.log(main('(if (= 12 12) (+ 78 2) 9)'))
// console.log(main('(if #f 1 0)'))
// console.log(main('(if #t "abc" 1)'))
// console.log(main('(if (< 3 45) (+ 1 2) "failedOutput")'))
// console.log(main('(if (> 3 45) (+ 1 1) "failedOutput")'))
// console.log(main('(if (< 3 2) 3 2)'))
// console.log(main('\'(+ 1 2)'))
// console.log(main('\'abc'))
// console.log(main('\'#(a b c)'))
// console.log(main('\'\'a'))
// console.log(main('(quote (where there is a will there is a way))'))
// console.log(main('(quote a)'))
// console.log(main('(quote (+ 1 2))'))
// console.log(main('(* pi 2)'))
// console.log(main('(define circle-area (* pi 2))'))
// console.log('lisp>>>>>', main('circle-area'))
// console.log(main('(define x (+ 2 10(+ 2 2)))'))
// console.log('>>>>>', main('x'))
// console.log(main('(define x (+ 2 10(* pi 2)))'))
// console.log('>>>>>', main('x'))
// console.log(main('(define x (+ 2 10))'))
// console.log(main('(define x (+ 2 10(+ 2 2)))'))
// console.log('lisp>>>>>', main('(define x 10)'))
// console.log('lisp>>>>>', main('x'))
// console.log(main('(definex 10)'))
// console.log(main('#t'))
// console.log(main('#f'))
// console.log(main('pi'))
// console.log(main('+'))
// console.log(main('-'))
// console.log(main('<='))
// console.log(main('(sqrt 4)'))
// console.log(main('2'))
// console.log(main('22'))
// console.log(main('+22'))
// console.log(main('0'))
// console.log(main('+0'))
// console.log(main('2.2'))
// console.log(main('-2.2'))
// console.log(main('(+2 4 1 9)'))
// console.log(main('(+ 2 4 1 9'))
// console.log(main('(+ 2 4 1   9)'))
// console.log(main('(+ 2  4  1  9)'))
// console.log(main('(+ 2 4 1 9 -1 1.2)'))
// console.log(main('(+ 2 (+ 2 4))'))
// console.log(main('(+ 2 (* 2 4) 3)'))
// console.log(main('(+ 2 (+ 2 4) (+ 3) 1)'))
// console.log(main('(+ 2 (+ 2 4 (* 2 2)) (+ 3) 1)'))
// console.log(main('(+ 2 (+ 2 4 (*2 2)) (+ 3) 1)')) // invalid exp
// console.log(main(' ( + 2 ( + 2 4 ( * 2 2 )  ( + 3) 1 )')) // invalid brace count
// console.log(main('(+ 3 3 (+ 1 (/ 2 2))  5)'))
// console.log(main('( + ( + ( + 9 (+ 2 2)) 2) ( + 3 4) )'))
// console.log(main('(+ (+ 1 (- 1 1)) 1)'))

// comparsision >=
// console.log(main('(>= 1 2 3)'))
// console.log(main('(>= 3 2 1)'))
// console.log(main('(>= 3 2 1 3)'))
// console.log(main('(>= 3 2 1 3 1 3.5)'))

// comparsision <=
// console.log(main('(<= 1 2 3)'))
// console.log(main('(<= 3 2 1)'))
// console.log(main('(<= 3 2 1 3)'))
// console.log(main('(<= 3 2 1 3 1 3.5)'))

// comparsision =
// console.log(main('(= 1 2 3)'))
// console.log(main('(= 1 1 1)'))
// console.log(main('(=  3 3 1 2 3)'))

// comparsision >
// console.log(main('(> 1 2 3)'))
// console.log(main('(> 1 1 1)'))
// console.log(main('(>  3 3 1 2 3)'))

// comparsision <
// console.log(main('(< 1 2 3)'))
// console.log(main('(< 1 1 1)'))
// console.log(main('(<  3 3 1 2 3)'))
