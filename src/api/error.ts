import { pathOr } from 'ramda'
import { APIContext } from 'api'

export function throwApiError(error: Error & { response: any }) {
  const basicName = 'API error default message'
  console.log('throwApiError ', error)
  if (error.response) {
    if (__DEV__) {
      console.warn({ error })
    }
    const fallbackMessage = pathOr(
      basicName,
      ['response', 'data', 'message'],
      error,
    )
    const name = pathOr(
      fallbackMessage,
      ['response', 'data', 'description'],
      error,
    )
    const status = pathOr(500, ['response', 'status'], error)
    const method = pathOr('get', ['response', 'config', 'method'], error)
    const url = pathOr('<undefined url>', ['response', 'config', 'url'], error)
    const message = `[${status}] ${method.toUpperCase()} ${url}`
    const apiError = new Error(message)
    // @ts-ignore
    apiError.refreshTokenError =
      status === 400 && url.includes('protocol/openid-connect/token')
    apiError.name = name
    if (status === 403) {
      APIContext.store.dispatch({
        type: 'LOGOUT_REQUESTED',
      })
    } else {
      throw apiError
    }
  } else {
    throw error
  }
}

export const throwTokensExpire = () => {
  throw new Error('token_expire')
}
