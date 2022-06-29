import axios, { AxiosResponse } from 'axios'
import { pick, pickBy, is } from 'ramda'
import { Env } from 'env'
import { getVersion } from 'utilities/version'
import { styleString } from './consoleColor'
import { RequestConfig, addTokenAsync } from './addTokenInterceptor'
import { APIContext } from 'api'

export const DEFAULT_CONTENT_TYPE = 'application/json; charset=utf-8'

const baseHeader = {
  'X-From': Env.appName,
  'X-From-Version': getVersion(),
}

// Standard request
export const axiosStandard = axios.create({
  baseURL: Env.api.base,
  headers: {
    'Content-Type': DEFAULT_CONTENT_TYPE,
    Accept: 'application/json',
    ...baseHeader,
  },
})

axiosStandard.interceptors.request.use(addTokenAsync)

export const runRequestAsync = (opts: RequestConfig) =>
  // @ts-ignore
  axiosStandard({
    ...opts,
    headers: pickBy(is(String), {
      ...opts.headers,
      Authorization: opts.token && `Bearer ${opts.token}`,
    }),
  })

// Auth request
const axiosAuth = axios.create({ headers: { ...baseHeader } })
// @ts-ignore
export const runAuthRequestAsync = (opts: RequestConfig) => axiosAuth(opts)

// Logger on dev to show all requests / response
if (__DEV__) {
  const logRequest = (config: RequestConfig) => {
    console.log(
      '%cREQ',
      styleString('orange'),
      pick(['method', 'url', 'headers'], config),
    )
    return config
  }

  const logResponse = (response: AxiosResponse) => {
    const extractData = pick(['status', 'data'], response)
    if (extractData.status >= 400) {
      console.log(
        '%cRES',
        styleString('red'),
        pick(['method', 'url'], response.config),
        pick(['status', 'data'], response),
      )
    } else {
      console.log(
        '%cRES',
        styleString('lime'),
        pick(['method', 'url'], response.config),
        pick(['status', 'data'], response),
      )
    }

    return response
  }

  axiosAuth.interceptors.request.use(logRequest)
  axiosStandard.interceptors.request.use(logRequest)

  axiosAuth.interceptors.response.use(logResponse, (error: any) => {
    if (error.response) {
      console.log(
        '%cRES',
        styleString('red'),
        pick(['method', 'url'], error.response.config),
        pick(['status', 'data'], error.response),
      )
      if (error.response.status === 403 && APIContext.store) {
        APIContext.store.dispatch({
          type: 'LOGOUT_REQUESTED',
        })
      }
    }
  })
  axiosStandard.interceptors.response.use(logResponse)
}

export const errorProneAxios = axios.create({
  validateStatus: () => true,
})
