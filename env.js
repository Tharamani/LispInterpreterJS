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
  pow: (...args) => (args.length === 2 ? Math.pow(args[0], args[1]) : null)
}
