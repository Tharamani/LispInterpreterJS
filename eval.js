import { getArgs, parsers } from './parse.js'

const specialForms = ['if', 'define', 'quote', 'lambda', 'set!', 'begin']

const numberEval = input => {
  if (isNaN(Number(input))) return null
  return Number(input)
}

const stringEval = (input) => {
  const matched = input.match(/".*"/)
  if (matched !== null) return input
  return null
}

function symbolEval (input, env) {
  // console.log('symbolEval ', input, env[input])
  if (env[input] === undefined) return null
  return env[input]
}

export const atomEval = (atom, env) => {
  // console.log('atomEval input', input)

  if (numberEval(atom) === 0) return 0
  return numberEval(atom, env) || stringEval(atom, env) || symbolEval(atom, env)
}

// syntax:  (begin <expression1> <expression2> ...)
const beginEval = (args, env) => {
  // console.log('beginEval : ', args)
  args.forEach(arg => {
    // console.log('beginEval : arg : ', arg)
    expressionEval(arg, env)
  })
  // console.log('beginEval args : ', args, args[args.length - 1])
  return expressionEval(args[args.length - 1], env)
}

// (if testExpr conseqExpr altExpr)
const ifEval = (args, env) => {
  const test = args[0]
  const consequent = args[1]
  const alternate = args[2]

  if (expressionEval(test, env) === false) return expressionEval(alternate, env)

  return expressionEval(consequent, env)
}

// (quote exp)
const quoteEval = (args) => {
  const value = args[0]

  return value
}

// syntax:  (set! <variable> <expression>)
const setEval = (args, env) => {
  const variable = args[0]
  const input = args[1]

  env[variable] = expressionEval(input, env)
  // console.log(`${variable} Set`)

  return [null, input.slice(1)]
}

// Define eval
// syntax: (define symbol exp)
const defineEval = (args, env) => {
  const symbol = args[0] // symbol
  const expression = args[1]

  env[symbol] = expressionEval(expression, env)
  // console.log(`${symbol} defined`)

  return [null, args.slice(1)]
}

// syntax:  (lambda <formals> <body>)
const lambdaEval = (args, env) => {
  const formals = args[0].slice(1).trim() // (args1, args2...)
  const formalArgs = getArgs(formals)
  const body = args[1]

  const localEnv = Object.create(env)

  function lambdaJS (...funcArgs) {
    funcArgs.forEach((arg, index) => {
      localEnv[formalArgs[index]] = arg
    })
    return expressionEval(body, localEnv)
  }

  return lambdaJS
}

// special forms
export const specialFormEval = (sFormsOp, args, env) => {
  if (sFormsOp === 'if') return ifEval(args, env)
  if (sFormsOp === 'define') return defineEval(args, env)
  if (sFormsOp === 'quote') return quoteEval(args)
  if (sFormsOp === 'set!') return setEval(args, env)
  if (sFormsOp === 'begin') return beginEval(args, env)
  if (sFormsOp === 'lambda') return lambdaEval(args, env)
}

const compoundEval = (expstr, env) => {
  expstr = expstr.slice(1) // slice '('

  const parsed = parsers(expstr)
  if (parsed === null) return null

  const operator = parsed[0] // operator
  expstr = parsed[1]
  // console.log('compoundEval operator : ', operator)

  const args = getArgs(expstr, env) // get args to eval
  // console.log('compoundEval args : ', args)

  if (specialForms.includes(operator)) return specialFormEval(operator, args, env) // special forms

  const evalArgs = args.map(arg => {
    // if (env[arg]) throw new Error('Invalid indentifier')
    return expressionEval(arg, env)
  })

  const operatorExpr = expressionEval(operator, env)
  return operatorExpr(...evalArgs)
}

// input rename to expstr
export const expressionEval = (expstr, env) => {
  expstr = expstr.trim()
  if (env[expstr] !== undefined) return env[expstr]
  if (expstr.startsWith('(')) return compoundEval(expstr, env)
  return atomEval(expstr, env)
}
