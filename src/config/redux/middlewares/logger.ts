import { createLogger } from 'redux-logger'

// @ts-ignore
const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent

export default createLogger({
  predicate: () => __DEV__,
  collapsed: true,
  duration: isDebuggingInChrome,
  timestamp: isDebuggingInChrome,
  logErrors: true,
  diff: true,
  colors: !isDebuggingInChrome && {
    title: false,
    prevState: false,
    action: false,
    nextState: false,
    error: false,
  },
  stateTransformer: state =>
    !isDebuggingInChrome ? { no: 'chrome console' } : state,
})
