const globalEnv = {
  '+': (...args) => args.reduce((acc, cv) => acc + cv, 0),
  '-': (...args) => args.reduce((acc, cv) => acc - cv),
  '*': (...args) => args.reduce((acc, cv) => acc * cv, 1),
  '/': (...args) => (args.length === 2 ? args[0] / args[1] : null),
  '>=': (...args) => {
    // const arr = args.map((val, i, arr) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val >= arr[i + 1]
    })
      .filter(val => val !== undefined)
      .every(val => val)
    // console.log('every ', arr)
    // return arr.every(val => val)
  },
  '<=': (...args) => {
    // const arr = args.map((val, i, arr) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val <= arr[i + 1]
    })
      .filter(val => val !== undefined)
      .every(val => val)
    // console.log('every ', arr)
    // return arr.every(val => val)
  },
  '=': (...args) => {
    // const arr = args.map((val, i, arr) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val === arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
    // console.log('every ', arr)
    // return arr.every(val => val)
  },
  '>': (...args) => {
    // const arr = args.map((val, i, arr) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val > arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
    // console.log('every ', arr)
    // return arr.every(val => val)
  },
  '<': (...args) => {
    // const arr = args.map((val, i, arr) => {
    return args.map((val, i, arr) => {
      if (arr[i + 1] !== undefined) return val < arr[i + 1]
    }).filter(val => val !== undefined).every(val => val)
    // console.log('every ', arr)
    // return arr.every(val => val)
  },
  '#t': true,
  '#f': false,
  pi: Math.PI,
  sqrt: (...args) => Math.sqrt(args[0])
}

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
  return globalEnv[input]
}

// symbol parser
const symbolParser = (input) => {
  console.log('symbolParser', input)
  if (input.startsWith('(')) return null

  input = input.trim()
  let lFunction = ''

  while (input[0] !== ' ' && input[0]) {
    console.log('while input', input, input[0])
    lFunction += input[0]
    input = input.slice(1)
  }
  console.log('symbolParser lFunction', [lFunction, input.slice(1).trim()])
  // if (globalEnv[lFunction] !== undefined)
  return [lFunction, input.slice(1).trim()]
  // return null
}

const expressionParser = (input) => {
  console.log('expressionParser', input)
  let expressionStr = input.slice(1) // input = (...) ) // expression = ...) )
  let count = 1
  while (count !== 0) {
    if (expressionStr[0] === '(') count++
    if (expressionStr[0] === ')') count--
    expressionStr = expressionStr.slice(1)
  }
  console.log('str', expressionStr.trim())
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

  const variable = parsed[0] // variable
  input = parsed[1]
  console.log('defineEval variable', variable)

  parsed = expressionEval(input)
  console.log('defineEval parsed', parsed)
  if (parsed === null) return null

  const expression = parsed[0] // value/expression
  input = parsed[1]
  console.log('defineEval expression', expression)

  console.log('defineEval input', input)
  if (input[0] !== ')') return null

  env[variable] = expression// expressionEval(expression, env)

  console.log(`${variable} defined`)

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

  input = input.slice(1) // slice '('

  let parsed = expressionEval(input)
  console.log('ifEval parsed', parsed)

  const ifSF = parsed[0]
  console.log('ifEval ifSF', ifSF)
  if (ifSF !== 'if') return null

  input = parsed[1]
  console.log('ifEval input', input)

  parsed = expressionEval(input)
  console.log('ifEval parsed', parsed)

  const test = parsed[0]
  console.log('ifEval test', test)

  input = parsed[1]
  console.log('ifEval input', input)

  parsed = expressionEval(input)
  console.log('ifEval parsed', parsed)

  const consequent = parsed[0]
  console.log('ifEval consequent', consequent)

  input = parsed[1]
  console.log('ifEval input', input)

  parsed = expressionEval(input)
  console.log('ifEval parsed', parsed)

  const alternate = parsed[0]
  console.log('ifEval alternate', alternate)

  input = parsed[1]
  console.log('ifEval input', input)

  if (input[0] !== ')') return null
  if (test) return consequent
  return alternate
}

let count = 0
// compound eval
const functionEval = (input) => {
  if (!input.startsWith('(')) return null
  count++

  console.log('functionEval', input)
  input = input.slice(1) // slice '('

  const parsed = expressionEval(input)
  if (parsed === null) return null

  const lFunction = parsed[0] // lFunction
  console.log('functionEval parsed', parsed, lFunction, parsed[1])
  if (globalEnv[lFunction] === undefined) return null
  input = parsed[1] // args in string
  const output = []

  // if (specialForms.includes(lFunction)) return formParser(lFunction, input, globalEnv)

  while (input[0] !== ')' && input[0]) {
    // if (expression) {
    const args = expressionEval(input)
    // console.log('compoundEval args, args[0], args[1]', args, args[0], args[1])
    console.log('functionEval args, args[0], args[1]', args, args[0], args[1], globalEnv[args[0]])
    if (args === null) return null
    if (args[0] === 'pi') output.push(globalEnv[args[0]])
    else {
      output.push(args[0])
    }
    input = args[1]
    console.log('functionEval input', output, input)
    // }
  }
  if (input[0] === ')') {
    input = input.slice(1)
    count--
    console.log('input[0] === close brace', count, input, output)
    if (globalEnv[lFunction] !== undefined) return [globalEnv[lFunction](...output), input.trim()]
  }
  console.log('count', count)
  if (count !== 0) return null
  return null
}

// null, [value, remainingstring]
const expressionEval = (input) => {
  console.log('expressionEval', input)
  input = input.trim()
  console.log('expressionEval trim', input)

  // if (input[0] === '\'') input = input.slice(1)
  if (input[0] === '\'') return input.slice(1)
  if (functionParser(input) === false) return false
  console.log('expressionEval ', input)
  // return null, [value, remaining string]
  return numberParser(input) || functionParser(input) || symbolParser(input) || functionEval(input) || defineEval(input, globalEnv) || quoteEval(input) || ifEval(input) // || stringParser(input)
}

// console.log(expressionEval('(+ 2 3 (if (> 3 2) 3 2) (+ 2))'))
// console.log(expressionEval('(if (= 12 12) (+ 78 2) 9)'))
// console.log(expressionEval('(if #f 1 0)'))
// console.log(expressionEval('(if #t "abc" 1)'))
// console.log(expressionEval('(if (> 30 45) (+ 1 1) "failedOutput" )'))
// console.log(expressionEval('(if (< 3 2) 3 2)'))
// console.log(expressionEval('\'(+ 1 2)'))
// console.log(expressionEval('\'abc'))
// console.log(expressionEval('\'#(a b c)'))
// console.log(expressionEval('\'abc'))
// console.log(expressionEval('\'\'a'))
console.log(expressionEval('(quote (+ 1 2))'))
// console.log(expressionEval('(quote a)'))
// console.log(expressionEval('(quote #(a b c))'))
// console.log(expressionEval('(quote (+ 1 2))'))
// console.log(expressionEval('(* pi 2)'))
// console.log(expressionEval('(define circle-area (* pi 2))'))
// console.log('lisp>>>>>', expressionEval('circle-area'))
// console.log(expressionEval('(+ 2 (define x (+ 2 10(+ 2 2))))'))
// console.log(expressionEval('(define x (+ 2 10(* pi 2)))'))
// console.log(expressionEval('(define x (+ 2 10))'))
// console.log(expressionEval('(define x (+ 2 10(+ 2 2)))'))
// console.log('lisp>>>>>', expressionEval('(define x 10)'))
// console.log('lisp>>>>>', expressionEval('x'))
// console.log(expressionEval('(definex 10)'))
// console.log(expressionEval('#t'))
// console.log(expressionEval('#f'))
// console.log(expressionEval('pi'))
// console.log(expressionEval('+'))
// console.log(expressionEval('-'))
// console.log(expressionEval('<='))
// console.log(expressionEval('(sqrt 4)'))
// console.log(expressionEval('2'))
// console.log(expressionEval('22'))
// console.log(expressionEval('+22'))
// console.log(expressionEval('0'))
// console.log(expressionEval('+0'))
// console.log(expressionEval('2.2'))
// console.log(expressionEval('-2.2'))
// console.log(expressionEval('(+2 4 1 9)'))
// console.log(expressionEval('(+ 2 4 1 9'))
// console.log(expressionEval('(+ 2 4 1   9)'))
// console.log(expressionEval('(+ 2  4  1  9)'))
// console.log(expressionEval('(+ 2 4 1 9 -1 1.2)'))
// console.log(expressionEval('(+ 2 (+ 2 4))'))
// console.log(expressionEval('(+ 2 (* 2 4) 3)'))
// console.log(expressionEval('(+ 2 (+ 2 4) (+ 3) 1)'))
// console.log(expressionEval('(+ 2 (+ 2 4 (* 2 2)) (+ 3) 1)'))
// console.log(expressionEval('(+ 2 (+ 2 4 (*2 2)) (+ 3) 1)'))
// console.log(expressionEval(' ( + 2 ( + 2 4 ( * 2 2 )  ( + 3) 1 )')) // invalid brace count
// console.log(expressionEval(' ( + 2 ( + 2 4  * 2 2  ) ( + 3) 1 )')) // invalid atom
// console.log(expressionEval('(+ 2 (* 2 4) + 3)'))
// console.log(expressionEval('(+ 3 3 (+ 1 (/ 2 2))  5)'))

// comparsision >=
// console.log(expressionEval('(>= 1 2 3)'))
// console.log(expressionEval('(>= 3 2 1)'))
// console.log(expressionEval('(>= 3 2 1 3)'))
// console.log(expressionEval('(>= 3 2 1 3 1 3.5)'))

// comparsision <=
// console.log(expressionEval('(<= 1 2 3)'))
// console.log(expressionEval('(<= 3 2 1)'))
// console.log(expressionEval('(<= 3 2 1 3)'))
// console.log(expressionEval('(<= 3 2 1 3 1 3.5)'))

// comparsision =
// console.log(expressionEval('(= 1 2 3)'))
// console.log(expressionEval('(= 1 1 1)'))
// console.log(expressionEval('(=  3 3 1 2 3)'))

// comparsision >
// console.log(expressionEval('(> 1 2 3)'))
// console.log(expressionEval('(> 1 1 1)'))
// console.log(expressionEval('(>  3 3 1 2 3)'))

// comparsision <
// console.log(expressionEval('(< 1 2 3)'))
// console.log(expressionEval('(< 1 1 1)'))
// console.log(expressionEval('(<  3 3 1 2 3)'))
