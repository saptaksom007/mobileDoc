import {
  pipe,
  pick,
  tap,
  prop,
  evolve,
  pathOr,
  length,
  gt,
  propOr,
  multiply,
} from 'ramda'
import moment from 'moment'
import * as querystring from 'query-string'
import { api } from 'common-docdok'

import { Env } from 'env'
import KeycloakUtil from 'utilities/keycloak'
import { runAuthRequestAsync } from 'utilities/axios'
import { then, catchP } from 'utilities/pointFreePromise'
import {
  setStorageItem,
  setStorageItemEncrypted,
  getStorageItem,
  deleteStorageItemAsync,
  clearCookiesAsync,
  deleteStorageItem,
} from 'utilities/localStorage'
import jwtDecode from 'jwt-decode'

import { APIContext } from 'api'

import {
  LIMITED_ACCESS_TOKEN_KEY,
  LIMITED_ACCESS_TOKEN_EXP_KEY,
} from 'config/auth'

import { throwApiError } from './error'

import { getStorageItemDecrypted } from '../utilities/localStorage'

const { keycloak } = Env

const jwtDecodeOneArity = (x: string) => jwtDecode(x)

export const extractExp = pipe<string, any, number, number>(
  jwtDecodeOneArity,
  propOr<string>('', 'exp'),
  multiply(1000),
)

// Select keys we need from original token information object.
export const pickAuthInfos = pick([
  'access_token',
  'refresh_token',
  'expires_in',
  'refresh_expires_in',
  'me',
])

// Retrieve tokens from the state (async).
export const getTokensStore = pipe(
  () => APIContext.store && APIContext.store!.getState(),
  prop(Env.storage.authKey),
  pickAuthInfos,
)

// Store limited access token into local storage (encrypted)
export const storeLimitedAccessToken = (token: string) =>
  setStorageItemEncrypted(LIMITED_ACCESS_TOKEN_KEY, token)

// Store token EXPIRATION into local storage
export const storeLimitedAccessTokenExp = pipe<
  string,
  number,
  string,
  any,
  any
>(
  extractExp,
  String,
  setStorageItem(LIMITED_ACCESS_TOKEN_EXP_KEY),
  catchP(throwApiError),
)

/**
 * Get limited access token from local storage
 * @param {string} token
 * @return {Promise}
 */
export const getLimitedAccessTokenExpirationFromStoreAsync: () => Promise<
  string
> = (key: string = LIMITED_ACCESS_TOKEN_EXP_KEY) =>
  pipe(getStorageItem, catchP(throwApiError))(key)

/**
 * Get limited access token from API
 * @return {Promise}
 */
export const getLimitedAccessTokenAsync = () =>
  pipe(
    api.getLimitedAccessToken,
    then(propOr('', 'data')),
    then(tap(storeLimitedAccessToken)),
    then(tap(storeLimitedAccessTokenExp)),
    then((limitedAccessToken: any) => ({
      limitedAccessToken,
      limitedAccessTokenExp: extractExp(limitedAccessToken),
    })),
    catchP(throwApiError),
  )()

/**
 * Predicate that said if access is limited or not
 * @param {Object} store
 * @return {boolean}
 */
export const limitedAccessPredicate = pipe(
  pathOr([], ['appointmentslist', 'rawList']),
  length,
  gt(0),
)

// Convert the number seconds to timestamp number (UNIX)
export const elapseTimeToTimestamp = (expiresIn: number) => {
  const result = moment()
    .add({ minutes: expiresIn })
    // .add({ seconds: expiresIn })
    .valueOf()

  return result
}

// Transform expires_in to timestamp
export const transformTimestamp = () => ({
  expires_in: elapseTimeToTimestamp,
  refresh_expires_in: elapseTimeToTimestamp,
})

// Axios option for getting tokens from code into URL obtain from webview.
export const optsRetrieveTokens = (code: string): any => ({
  url: `${KeycloakUtil.getRealmUrl()}/protocol/openid-connect/token`,
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: querystring.stringify({
    grant_type: 'authorization_code',
    redirect_uri: keycloak.redirectUri,
    client_id: keycloak.clientId,
    code,
  }),
})

// Retrieve tokens async from keycloack URL.

export const retrieveTokensAsync = (url: string) =>
  pipe(
    KeycloakUtil.getCodeAndStateFromUrl,
    prop('code'),
    optsRetrieveTokens,
    runAuthRequestAsync,
    then(prop('data')),
    then(pickAuthInfos),
    then(evolve(transformTimestamp())),
    catchP(throwApiError),
    // @ts-ignore
  )(url)

// Generic function to test if token expire or not
export const expireToken = (expires_in: number) =>
  expires_in > Number(new Date().getTime())

// Is id token valid ?
export const isIdTokenValid = pipe<{ expires_in: number }, number, boolean>(
  prop('expires_in'),
  expireToken,
)

// Is refresh token valid ?
export const isRefreshTokenValid = pipe<
  { refresh_expires_in: number },
  number,
  boolean
>(prop('refresh_expires_in'), expireToken)

// Axios optins for fefreshing the access_token from refresh_token
export const optsRefreshTokens = (refresh_token: string) => {
  const data = {
    url: `${KeycloakUtil.getRealmUrl()}/protocol/openid-connect/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      grant_type: 'refresh_token',
      redirect_uri: keycloak.redirectUri,
      client_id: keycloak.clientId,
      refresh_token,
    }),
  }

  return data
}

// Refresh actual access_token
export const refreshingTokenAsync = (refresh_token: string) =>
  pipe(
    optsRefreshTokens,
    runAuthRequestAsync,
    then(prop('data')),
    then(pickAuthInfos),
    then(evolve(transformTimestamp())),
    catchP(throwApiError),
  )(refresh_token)

// Dispatch redux action named REFRESH_TOKEN_REQUESTED
export const dispatchRefreshTokenAction = (newTokens: any) => {
  const { store } = APIContext
  if (store) {
    store.dispatch({ type: 'REFRESH_TOKEN_REQUESTED', newTokens })
  }
}

// Core function that check if token expired or refresh the token.
const getTokenOrDispatchRefreshingAsync = async (tokens: any) => {
  if (isIdTokenValid(tokens)) {
    return tokens
  }
  if (isRefreshTokenValid(tokens)) {
    try {
      // TODO: fix it!
      const newTokens = await refreshingTokenAsync(tokens.refresh_token)
      dispatchRefreshTokenAction(newTokens)
      return newTokens
    } catch (error) {
      console.warn({ error })
    }
  }
  if (APIContext.store) {
    APIContext.store.dispatch({ type: 'SESSION_HAS_EXPIRED' })
  }
  return {}
}

// Retrieve token from storage (redux state) or get from keycloack API
// and dispatch action to refresh tokens in current app state. (async)
export const checkAndGetTokenAsync = pipe(
  getTokensStore,
  getTokenOrDispatchRefreshingAsync,
  then(propOr('', 'access_token')),
  catchP(throwApiError),
)

// Axios options for logout function
export const optsLogOut = (refresh_token: string) => ({
  url: `${KeycloakUtil.getRealmUrl()}/protocol/openid-connect/logout`,
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: querystring.stringify({
    client_id: keycloak.clientId,
    refresh_token,
  }),
})

// Get limited access token from local storage (decrypted)
export const getLimitedAccessTokenFromStoreAsync = pipe(
  getStorageItemDecrypted,
  catchP(throwApiError),
)

// Get limited access token with params
export const getLimitedAccessTokenFromStoreAsyncWithParams = pipe(
  async (_args: any) => {
    const token = await getLimitedAccessTokenFromStoreAsync(
      LIMITED_ACCESS_TOKEN_KEY,
    )
    return { ..._args, token }
  },
  catchP(throwApiError),
)

export const removeLimitedAccessToken = () =>
  deleteStorageItemAsync(LIMITED_ACCESS_TOKEN_KEY)

export const persistExpireInAsync = (expiresIn: number) =>
  setStorageItem('expiresIn', `${expiresIn}`)

export const isStillLoggedAsync = async () => {
  const expiresInStr = await getStorageItem('expiresIn')
  const expiresIn = Number(expiresInStr)
  const now = new Date().getTime()
  const isStillLogged = !!expiresInStr && now < expiresIn

  return isStillLogged
}

// Logout async function and stop auth timeout if exist.
export const logoutAsync = (refreshToken: string) =>
  pipe(
    optsLogOut,
    runAuthRequestAsync,
    then(clearCookiesAsync),
    then(() => deleteStorageItem('expiresIn')),
    catchP(throwApiError),
  )(refreshToken)
