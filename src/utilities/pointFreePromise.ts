import { curry, tap } from 'ramda'
import { styleString } from './consoleColor'

// then :: f -> Thenable -> Thenable
export const then = curry((f: (x: any) => any, thenable: Promise<any>) =>
  thenable.then(f),
)

// catchP :: f -> Promise -> Promise
export const catchP = curry((f: (x: any) => any, promise: Promise<any>) =>
  promise.catch(f),
)

// wrap :: (string, *) -> object
export const wrap = curry((key: string, value: any) => ({ [key]: value }))

// log :: string -> *
export const log = tap((logThis: any) =>
  console.log(
    '%c[ LOG ]\n',
    styleString('blue'),
    JSON.stringify(logThis, null, 2),
  ),
)

// log :: string -> Promise<*>
export const logAsync = then(log)
