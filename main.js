import { globalEnv } from './env.js'
import { parsers } from './parse.js'
import { expressionEval } from './eval.js'

export const main = (input) => {
  try {
    // replace '\'' => (quote input)
    if (input[0] === '\'') input = '(quote ' + input.slice(1) + ')'

    // enclose input with begin exp => (begin input)
    input = '(begin ' + input + ')'

    const parsed = parsers(input)
    if (parsed === null) return null

    const parsedInput = parsed[0]
    const remainingString = parsed[1]

    if (remainingString === '') return expressionEval(parsedInput, globalEnv)
    throw new Error('Invalid expression, please provide valid expression')
  } catch (error) {
    console.log('<<<<<<<<<<<<<<<<< Error >>>>>>>>>>>', error)
  }
}
