import { first, filter } from 'lodash'

export function chain (fns, values) {
  return fns.reduce((p, c) => {
    return c(p)
  }, values)
}

export function ifNotNil (fn) {
  return function (...args) {
    if (filter(args, [null, undefined, false]).length) {
      return fn(...args)
    } else {
      return args.length === 1
        ? first(args)
        : args
    }
  }
}
