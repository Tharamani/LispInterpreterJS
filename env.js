export const globalEnv = {
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
  pow: (...args) => (args.length === 2 ? Math.pow(args[0], args[1]) : null),
  car: (...args) => {
    if (args.length === 1) return args[0][0]
    throw new Error('Invalid number of args')
  },
  cdr: (...args) => {
    if (args.length === 1) return args[0].slice(1)
    throw new Error('Invalid number of args')
  },
  not: x => !x,
  isNull: x => Array.isArray(x) && x.length === 0,
  isNotNull: x => x.length !== 0,
  cons: (a, b) => {
    if (b === '()') return [a]
    return [a].concat(b)
  },
  map: (f, array) => {
    return array.map((val, i, arr) => {
      return f(val)
    })
  }
}
