import { globalEnv } from './env.js'
import { parsers } from './parse.js'
import { expressionEval } from './eval.js'

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
