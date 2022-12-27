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

// number parser
const numberParser = input => {
  console.log('numberParser', input)
  const output = input.match(/^[+-]?((([1-9])(\d*))|(0))(\.\d+)?/)
  console.log('numberParser', output)
  if (output) return [Number(output[0]), input.slice(output[0].length).trim()]
  return null
}

const builtInFunctionParser = (input) => {
  console.log('builtInFunctionParser', input, globalEnv[input])
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
  if (globalEnv[lFunction] !== undefined) return [lFunction, input.slice(1).trim()]
  return null
}

let count = 0
// compound eval
const compoundEval = (input) => {
  if (!input.startsWith('(')) return null
  count++

  console.log('compoundEval', input)
  input = input.slice(1) // slice '('

  const parsed = expressionEval(input)
  if (parsed === null) return null

  const lFunction = parsed[0] // lFunction
  if (globalEnv[lFunction] === undefined) return null

  input = parsed[1] // args in string
  const output = []
  console.log('compoundEval parsed', parsed, lFunction, parsed[1])

  while (input[0] !== ')' && input[0]) {
    // if (expression) {
    const args = expressionEval(input)
    // console.log('compoundEval args, args[0], args[1]', args, args[0], args[1])
    if (args === null || globalEnv[args[0]]) return null
    output.push(args[0])
    input = args[1]
    console.log('compoundEval input', output, input)
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

const expressionEval = (input) => {
  console.log('expressionEval', input)
  input = input.trim()
  console.log('expressionEval trim', input)

  if (builtInFunctionParser(input) === false) return false
  return numberParser(input) || builtInFunctionParser(input) || symbolParser(input) || compoundEval(input)
}

// console.log(expressionEval('#t'))
// console.log(expressionEval('#f'))
// console.log(expressionEval('pi'))
// console.log(expressionEval('+'))
// console.log(expressionEval('-'))
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
