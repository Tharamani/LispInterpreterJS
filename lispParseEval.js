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
  sqrt: (args) => (args.length === 1 ? Math.sqrt(args[0]) : null)
}

const specialForms = ['if', 'define', 'quote', 'lambda', 'set!', 'begin']

// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^[+-]?((([1-9])(\d*))|(0))(\.\d+)?/)
  if (output) return [output[0], input.slice(output[0].length).trim()]
  return null
}

const numberEval = input => {
  console.log('numberEval', Number(input))
  if (isNaN(Number(input))) return null
  return Number(input)
}

const stringParser = (input) => {
  console.log('stringParser', input)
  const matched = input.match(/".*"/)
  console.log('stringParser matched', matched)
  if (matched !== null) return [matched[0].trim(), input.slice(input.length).trim()]
  return null
}

const stringEval = (input) => {
  console.log('stringEval', input)
  const matched = input.match(/".*"/) // #t, #f, pi is treated as string
  console.log('stringEval matched', matched)
  if (matched !== null) return input
  // if (typeof input === 'string' || input instanceof String) return input
  return null
}

const expressionParser = (input) => {
  console.log('expressionParser', input)
  input = input.trim()
  // expression
  let expressionStr = input.slice(1) // input = (...) ) // expression = ...) )
  console.log('expressionStr', input)
  let count = 1
  while (count !== 0 && expressionStr[0]) {
    if (expressionStr[0] === '(') count++
    if (expressionStr[0] === ')') count--
    expressionStr = expressionStr.slice(1)
  }

  console.log(input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim(), 'count', count)
  if (count === 0) return [input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim()]
  return null
}

// symbol parser // use regex to parse symbol
// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-5.html#%_sec_2.1
const symbolParser = (input) => {
  console.log('symbolParser', input)
  input = input.trim()
  const matched = input.match(/((^([a-zA-Z!$%&*+-./:<=>?@^_~#t#fpi])+)(\w)*)/)
  console.log('symbolParser matched ', matched)
  if (matched) return [matched[0], input.slice(matched[0].length).trim()]
  return null
}

const parsers = (input) => {
  console.log('parsers ', input)
  return numberParser(input) || stringParser(input) || symbolParser(input) || expressionParser(input)
}

function symbolEval (input, env) {
  console.log('symbolEval ', input, env[input])
  if (env[input] === undefined) return null
  return env[input]
}

const atomEval = (input, env) => {
  console.log('atomEval input', input)
  if (numberEval(input) === 0) return 0
  return numberEval(input, env) || stringEval(input, env) || symbolEval(input, env)
}

// args array
const getArgs = (input, env) => {
  console.log('getArgs input', input.length)
  const args = []
  input = input.trim()
  while (input[0] !== ')') {
    const parsed = parsers(input)
    // console.log('getArgs parsed', parsed)
    if (parsed === null) return null
    const value = parsed[0]
    // if (env[value] === 'pi') args.push(env[value])
    // if (env[value] !== undefined && env[value] !== 'pi') return null
    args.push(value)
    input = parsed[1]
  }
  console.log('getArgs args', args, input)
  if (input[0] === ')') return args
  throw new Error('Invalid expression')
}

// syntax:  (begin <expression1> <expression2> ...)
const beginEval = (args, env) => {
  args.forEach(arg => {
    expressionEval(arg, env)
  })
  return expressionEval(args[args.length - 1], env)
}

// syntax:  (set! <variable> <expression>)
const setEval = (input, env) => {
  if (!input.startsWith('(')) return null
  input = input.slice(1).trim() // slice '('

  if (!input.startsWith('set!')) return null
  input = input.slice('set!'.length).trim() // slice 'if'

  const parsed = symbolParser(input)
  const variable = parsed[0]
  input = parsed[1]

  if (env[variable] === undefined) return null
  env[variable] = expressionEval(expressionParser(input)[0], env)[0]
  console.log(`${variable} Set`)
  return [null, input.slice(1)]
}

// Define eval
// syntax: (define symbol exp)
const defineEval = (args, env) => {
  console.log('defineEval', args)

  const symbol = args[0] // symbol
  const expression = args[1]
  console.log('defineEval symbol expression', symbol, expression)

  // if (!specialForms.includes(symbol))
  env[symbol] = expressionEval(expression, env)
  console.log(`${symbol} defined`)
  // throw new Error('Invalid symbol')
  return [null, args.slice(1)]
}

// special forms
function formParser (sFormsOp, args, env) {
  // if (sFormsOp === 'if') return ifEval(input, env)
  if (sFormsOp === 'define') return defineEval(args, env)
  // if (sFormsOp === 'quote') return quoteEval(input)
  if (sFormsOp === 'set!') return setEval(input, env)
  if (sFormsOp === 'begin') return beginEval(args, env)
}

const compoundEval = (input, env) => {
  console.log('compoundEval input', input)

  input = input.slice(1) // slice '('
  console.log('compoundEval input slice', input)

  const parsed = parsers(input)
  console.log('compoundEval input parsed', parsed)
  if (parsed === null) return null

  const operator = parsed[0] // operator
  input = parsed[1]
  const args = getArgs(input, env) // get args to eval
  console.log('compoundEval operator, input, args', operator, args)

  if (specialForms.includes(operator)) return formParser(operator, args, env) // special forms

  if (env[operator] === undefined) throw new Error('Invalid operator')

  // const args = getArgs(input, env) // get args to eval
  if (args === null) return null
  console.log('compoundEval operator, input, args', operator, input, args)
  const argsEval = args.map(arg => {
    console.log('compoundEval expressionEval(arg)', expressionEval(arg, env))

    // if (arg) return expressionEval(arg, env)
    return expressionEval(arg, env)
    // return null
  })
  console.log('compoundEval argsEval', argsEval)
  // input = args[1]

  // if (input[0] === ')') {
  if (env[operator] !== undefined) {
    console.log('compoundExpEval env[operator] !==', env[operator], env[operator](...argsEval))
    return env[operator](...argsEval)
  }
  // }
  return null
}

const expressionEval = (input, env) => {
  console.log('expressionEval input', input)
  input = input.trim()
  if (input.startsWith('(')) return compoundEval(input, env)
  return atomEval(input, env)
}

const main = (input) => {
  try {
    console.log('input', input)

    const parsed = parsers(input)
    console.log('parsed', parsed)

    if (parsed === null) return null
    const parsedInput = parsed[0]
    console.log('parsedInput', parsedInput)

    const remainingString = parsed[1]
    console.log('remainingString', remainingString)

    if (remainingString === '') return expressionEval(parsedInput, globalEnv)
    throw new Error('Parsing error, Invalid expression')
  } catch (error) {
    console.log('<<<<<<<<<<<<<<<<< Error >>>>>>>>>>>', error)
  }
}

// begin
// console.log(main('(begin 9 66)'))
// console.log(main('(begin (define r 10) (* pi (* r r)))'))
// console.log(main('(begin (define r 10) (+ 1 2(* 2 (* r r))))'))

// define
// console.log(main('(define r 10)'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>>', main('r'))

// console.log(main('(define a (+ 1 2 3))'))
// console.log('>>>>>>>>>>>>>>>>>>>>>>>> a ', main('a'))

// console.log(main('(define x (+ 2 10 (* pi 2)))'))
// console.log('>>>>>', main('x'))

// main('(define define 1)')
// console.log('>>>>>', main('define'))

// main('(define r 1)')
// console.log(main('(+ r r)'))

// console.log(main('(define r 10)'))
// console.log(main('9r66'))

// expression
// console.log(main('(+ 2 3 2 3)'))
// console.log(main('(+2 3)'))
// console.log(main('(+ 2 3'))
// console.log(main('(+ 2 (+ 2 4))'))
// console.log(main('(+ 2 (+ 2 4)))'))
// console.log(main('(+ 2 4 1 9 -1 1.2)'))
// console.log(main('(+ 2  4  1  9)'))
// console.log(main('(+ 2 (* 2 4) + 3)')) // invalid expression, identifier
// console.log(main('(+ 2 (+ 2 4 (* 2 2)) (+ 3) 1)'))
// console.log(main('(+ 3 3 (+ 1 (/ 2 2))  5)'))
// console.log(main('(+ 2 (+ 2 4 (*2 2)) (+ 3) 1)'))

// numbers
// console.log(main('+23'))
// console.log(main('-2.2'))
// console.log(main('2'))
// console.log(main('+0'))
// console.log(main('(sqrt)'))
// console.log(main('(sqrt 4)'))
// string
// console.log(main('"a"'))
// console.log(main('"xyz"'))

// invalid
// console.log(main('+0abc'))

// symbols
// console.log(main('#t'))
// console.log(main('#f'))
// console.log(main('pi'))
// console.log(main('-'))
// console.log(main('<='))
// console.log(main('lamda'))
// console.log(main('the-word-recursion-has-many-meanings'))
