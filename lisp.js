const globalEnv = {
  '+': (...args) => args.reduce((acc, cv) => acc + cv, 0),
  '-': (...args) => args.reduce((acc, cv) => acc - cv),
  '*': (...args) => args.reduce((acc, cv) => acc * cv, 1),
  '/': (...args) => (args.length === 2 ? args[0] / args[1] : null),
  '>': (...args) => (args.length === 2 ? args[0] > args[1] : null),
  '<': (...args) => (args.length === 2 ? args[0] < args[1] : null),
  '>=': (...args) => (args.length === 2 ? args[0] >= args[1] : null),
  '<=': (...args) => (args.length === 2 ? args[0] <= args[1] : null),
  '=': (...args) => (args.length === 2 ? args[0] === args[1] : null),
  '#t': true,
  '#f': false,
  pi: Math.PI,
  sqrt: (...args) => Math.sqrt(args[0])
}

// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^[+-]?((([1-9])(\d*))|(0))(\.\d+)?/)
  if (output) return [Number(output[0]), input.slice(output[0].length)]
  return null
}

// symbol parser
const symbolParser = (input) => {
  console.log('symbolParser', input)
  if (input.startsWith('(')) return null

  input = input.trim()
  let lFunction = ''
  while (input[0] !== ' ') {
    lFunction += input[0]
    input = input.slice(1)
  }
  console.log('symbolParser lFunction', lFunction)
  return [lFunction, input.slice(lFunction.length)]
}

// compound eval
const compoundEval = (expression) => {
  if (!expression.startsWith('(')) return null

  console.log('compoundEval', expression)
  expression = expression.slice(1) // slice '('

  const parsed = expressionEval(expression)
  if (parsed === null) return null

  const lFunction = parsed[0] // lFunction
  expression = parsed[1] // args in string
  const output = []

  console.log('compoundEval parsed', parsed, lFunction, parsed[1])

  while (expression[0] !== ')') {
    const args = expressionEval(expression)
    console.log('compoundEval args', args)
    if (args[0] === null) return null
    output.push(args[0])
    expression = args[1]
    console.log('compoundEval expression', expression)
  }
  if (globalEnv[lFunction] !== undefined) return globalEnv[lFunction](...output)
}

// Checks for atom or expression and calls respective eval
const expressionEval = (input) => {
  console.log('expressionEval', input)
  input = input.trim()
  console.log('expressionEval trim', input)
  return numberParser(input) || symbolParser(input) || compoundEval(input)
}

// console.log(expressionEval('2'))
// console.log(expressionEval('22'))
// console.log(expressionEval('+22'))
// console.log(expressionEval('+ 22')) // handle
// console.log(expressionEval('+'))
// console.log(expressionEval('0'))
// console.log(expressionEval('+0'))
// console.log(expressionEval('2.2'))
// console.log(expressionEval('-2.2'))
console.log(expressionEval('(+ 2 4 1 9)'))
