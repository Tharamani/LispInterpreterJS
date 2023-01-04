import { parsers } from './parse.js'

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
  sqrt: (...args) => Math.sqrt(args[0]),
  list: (...args) => args,
  pow: (...args) => (args.length === 2 ? Math.pow(args[0], args[1]) : null)
}

const specialForms = ['if', 'define', 'quote', 'lambda', 'set!', 'begin']

const numberEval = input => {
  console.log('numberEval', Number(input))
  if (isNaN(Number(input))) return null
  return Number(input)
}

const stringEval = (input) => {
  console.log('stringEval', input)
  // if (!input.startsWith('"')) return null
  const matched = input.match(/".*"/) // #t, #f, pi is treated as string
  if (matched !== null) return input
  return null
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
    args.push(value)
    input = parsed[1]
  }
  // console.log('getArgs args', args, input)
  if (input[0] === ')') return args
  throw new Error('Invalid expression')
}

// syntax:  (begin <expression1> <expression2> ...)
const beginEval = (args, env) => {
  args.forEach(arg => {
    expressionEval(arg, env)
  })
  console.log('beginEval', args)
  return expressionEval(args[args.length - 1], env)
}

// (if testExpr conseqExpr altExpr)
const ifEval = (args, env) => {
  // if (!input.startsWith('(')) return null
  // input = input.slice(1).trim() // slice '('

  // if (!input.startsWith('if')) return null
  // input = input.slice('if'.length).trim() // slice 'if'

  // let parsed = expressionParser(input)
  const test = args[0]
  const consequent = args[1]
  const alternate = args[2]
  console.log('ifEval test, consequent, alternate', args, test, consequent, alternate)
  // if (expressionEval(test, env)[0] === false) return [expressionEval(alternate, env)[0], input.slice(1).trim()]
  if (expressionEval(test, env) === false) return expressionEval(alternate, env)
  return expressionEval(consequent, env)
}

// (quote exp)
const quoteEval = (args) => {
  // if (!input.startsWith('(')) return null
  // input = input.slice(1).trim() // slice '('

  // if (!input.startsWith('quote')) return null
  // input = input.slice('quote'.length).trim() // slice 'quote'

  // const parsed = expressionParser(input)
  // if (parsed === null) return null
  const value = args[0]
  console.log('quoteEval args', args, value)
  return value
}

// syntax:  (set! <variable> <expression>)
const setEval = (args, env) => {
  const variable = args[0]
  const input = args[1]

  console.log('setEval', variable, input)
  env[variable] = expressionEval(input, env)
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

  env[symbol] = expressionEval(expression, env)
  console.log(`${symbol} defined`)
  // throw new Error('Invalid symbol')
  return [null, args.slice(1)]
}

// syntax:  (lambda <formals> <body>)
const lambdaEval = (args, env) => {
  // input = input.slice(1).trim() // slice '('

  // if (!input.startsWith('lambda')) return null
  // input = input.slice('lambda'.length).trim() // slice 'lambda'
  const formals = args[0].slice(1).trim() // (args1, args2...)
  const formalArgs = getArgs(formals)
  const body = args[1]
  console.log('lambdaEval formalArgs body', formalArgs, body)

  const localEnv = Object.create(env)

  function lambdaJS (...funcArgs) {
    funcArgs.forEach((arg, index) => {
      console.log('lambdaEval forEach ', formalArgs[index], arg)
      localEnv[formalArgs[index]] = arg
    })
    return expressionEval(body, localEnv)
  }

  return lambdaJS
}

// special forms
function formParser (sFormsOp, args, env) {
  if (sFormsOp === 'if') return ifEval(args, env)
  if (sFormsOp === 'define') return defineEval(args, env)
  if (sFormsOp === 'quote') return quoteEval(args)
  if (sFormsOp === 'set!') return setEval(args, env)
  if (sFormsOp === 'begin') return beginEval(args, env)
  if (sFormsOp === 'lambda') return lambdaEval(args, env)
}

const compoundEval = (input, env) => {
  console.log('compoundEval input', input)

  input = input.slice(1) // slice '('
  // console.log('compoundEval input slice', input)

  const parsed = parsers(input)
  // console.log('compoundEval input parsed', parsed)
  if (parsed === null) return null

  let operator = parsed[0] // operator
  console.log('compoundEval operator', operator)
  input = parsed[1]
  const args = getArgs(input, env) // get args to eval
  console.log('compoundEval , args', args)

  if (specialForms.includes(operator)) return formParser(operator, args, env) // special forms

  const evalArgs = args.map(arg => {
    // console.log('compoundEval expressionEval(arg)', expressionEval(arg, env))
    return expressionEval(arg, env)
  })
  console.log('compoundEval evalArgs', evalArgs)

  if (env[operator] !== undefined) {
    console.log('compoundExpEval env[operator] !==', env[operator])
    return env[operator](...evalArgs)
  }
  if (operator.startsWith('(')) {
    operator = expressionEval(operator, env)
    console.log("operator.startsWith('(') operator", operator)
    return operator(...evalArgs)
  }
}

const expressionEval = (input, env) => {
  console.log('expressionEval input', input)
  input = input.trim()
  if (input.startsWith('(')) return compoundEval(input, env)
  return atomEval(input, env)
}

export const main = (input) => {
  try {
    console.log('GIven input', input)

    const parsed = parsers(input)
    console.log('parsed', parsed)

    if (input[0] === '\'') return input.slice(1)

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
