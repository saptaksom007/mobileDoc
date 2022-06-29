import { pipe, concat, cond, curry } from 'ramda'
import { v4 } from 'uuid'
import * as querystring from 'query-string'
import i18n from 'ex-react-native-i18n'

import { Env } from 'env'
import { ParseOptions } from 'querystring'
import { KeycloakClientType } from 'common-docdok/lib/common/Keycloak/keycloakProvider'

const { keycloak } = Env

interface KeycloakInfoType {
  userId?: string
  token?: string
  refreshToken?: () => Promise<any>
  expiresIn: number
}
export const KeycloakInfo: KeycloakInfoType = {
  userId: undefined,
  token: undefined,
  refreshToken: undefined,
  expiresIn: Infinity,
}
interface KeycloakToken {
  code: string
}
const parse = (querystring.parse as any) as (
  str: string,
  options?: ParseOptions,
) => KeycloakToken

export const addSlashToUrl = (url: string) =>
  url.endsWith('/') ? url : `${url}/`

export const concatUrl = curry((base: string, toAdd: string) =>
  concat(addSlashToUrl(base), toAdd),
)

export const getRealmUrl = (url: string, realm: string) =>
  concatUrl(url, `realms/${encodeURIComponent(realm)}`)

export const getQueryString = (
  redirectUri: string,
  clientId: string,
  uuid: string,
) =>
  querystring.stringify({
    redirect_uri: redirectUri,
    client_id: clientId,
    response_type: 'code',
    state: uuid,
    kc_locale: i18n.currentLocale().substr(0, 2) === 'de' ? 'de' : 'en',
  })

export const getLoginURL = (
  url: string,
  realm: string,
  redirectUri: string,
  clientId: string,
  state: string = v4(),
) =>
  concatUrl(
    getRealmUrl(url, realm),
    'protocol/openid-connect/auth?' +
      `${getQueryString(redirectUri, clientId, state)}`,
  )

const matchAuthURL = (url: string) =>
  url.startsWith(keycloak.redirectUri) &&
  url.includes('state=') &&
  url.includes('code=')

const hasHash = (url: string) => url.includes('#')
const hasQuestionMark = (url: string) => url.includes('?')

const getCodeAndStateFromUrlQuestionMark = pipe(
  querystring.extract,
  parse,
)

const matchOr = (or: string, str: string) => {
  const values = str.match(/#([^#]+)/)
  if (values) {
    return values[1]
  }
  return or
}
const getHash = (url: string) => matchOr('', url)

const getCodeAndStateFromUrlHash = pipe<string, string, KeycloakToken>(
  getHash,
  parse,
)

const getCodeAndStateFromUrl = cond<string, KeycloakToken>([
  [hasHash, getCodeAndStateFromUrlHash],
  [hasQuestionMark, getCodeAndStateFromUrlQuestionMark],
])

// curries
export const getLoginURLCurry = curry(getLoginURL)
export const getRealmUrlCurry = curry(getRealmUrl)

const UNKNOWN_USER_REF = '00000000-0000-0000-0000-000000000000'
export const getCommonKeycloakClient = (): KeycloakClientType => ({
  getUserId: () => KeycloakInfo.userId || UNKNOWN_USER_REF,
  getToken: () => KeycloakInfo.token!,
  refreshToken: KeycloakInfo.refreshToken!,
  isTokenExpired: () => Date.now() > KeycloakInfo.expiresIn,
  login: () => {
    throw Error('login is not implemented')
  },
  logout: () => {},
})

export default {
  getLoginURL: (uuid?: string): string =>
    getLoginURLCurry(
      keycloak.url,
      keycloak.realm,
      keycloak.redirectUri,
      keycloak.clientId,
      uuid,
    ),
  matchAuthURL,
  getCodeAndStateFromUrl,
  getCodeAndStateFromUrlHash,
  getCodeAndStateFromUrlQuestionMark,
  getRealmUrl: () => getRealmUrlCurry(keycloak.url, keycloak.realm),
}
