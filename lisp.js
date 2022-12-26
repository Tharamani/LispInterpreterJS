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

// Symbol parser
const symbolParser = (input) => {
  if (globalEnv[input] === undefined) return null
  console.log('symbolParser', globalEnv[input])
  if (globalEnv[input]) return [globalEnv[input], input.slice(input.length)]
  return globalEnv[input]
}
// const numberParser = (input) => {
//   console.log('numberParser', input)
//   if (isNaN(Number(input))) return null
//   return Number(input)
// }
// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^-?((([1-9])(\d*))|(0))(\.\d+)?([Ee][+-]?\d+)?/)
  console.log('valueParser', output)
  if (output) return [Number(output[0]), input.slice(output[0].length)]
  return null
}

// Value parser
const valueParser = (input) => {
  console.log('valueParser', input)
  input = input.trim()
  return numberParser(input) || symbolParser(input)
}

const atomEval = (input) => {
  console.log('atomEval', input)
  const output = []
  while (input[0]) {
    console.log('input[0]', input[0])
    const value = valueParser(input[0])
    console.log('value', value, value[0], value[1])
    if (value === null) return null
    output.push(value[0])
    if (value[1] !== ' ') return null
    input = value[1].trim()
  }
  return [output[0], input.slice(1)]
}

// Checks for atom or expression and calls respective eval
const expressionEval = (input) => {
  input = input.trim()

  // atom eval
  return atomEval(input)
//   const [lFunction, remainingInput] = [value[0], value[1]]
//   if (globalEnv[lFunction] !== undefined) return globalEnv[lFunction](...remainingInput)
}

console.log(expressionEval('+'))
