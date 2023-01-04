// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^[+-]?((([1-9])(\d*))|(0))(\.\d+)?/)
  if (output) return [output[0], input.slice(output[0].length).trim()]
  return null
}

const stringParser = (input) => {
  console.log('stringParser', input)
  if (!input.startsWith('"')) return null
  const matched = input.match(/".*"/)
  if (matched !== null) return [matched[0].trim(), input.slice(input.length).trim()]
  return null
}

const expressionParser = (input) => {
  console.log('expressionParser', input)
  input = input.trim()
  // expression
  let expressionStr = input.slice(1) // input = (...) ) // expression = ...) )
  // console.log('expressionStr', input)
  let count = 1
  while (count !== 0 && expressionStr[0]) {
    if (expressionStr[0] === '(') count++
    if (expressionStr[0] === ')') count--
    expressionStr = expressionStr.slice(1)
  }
  // console.log(input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim(), 'count', count)
  if (count === 0) return [input.slice(0, input.length - expressionStr.length).trim(), expressionStr.trim()]
  return null
}

// symbol parser // use regex to parse symbol
// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-5.html#%_sec_2.1
const symbolParser = (input) => {
  console.log('symbolParser', input)
  input = input.trim()
  const matched = input.match(/((^([a-zA-Z!$%&*+-./:<=>?@^_~#t#fpi])+)(\w)*)/)
  // console.log('symbolParser matched ', matched)
  if (matched) return [matched[0], input.slice(matched[0].length).trim()]
  return null
}

export const parsers = (input) => {
  console.log('parsers ', input)
  input = input.trim()

  return numberParser(input) || stringParser(input) || symbolParser(input) || expressionParser(input)
}

// args array
export const getArgs = (input, env) => {
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
