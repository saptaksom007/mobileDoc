import { AxiosRequestConfig } from 'axios'
import { Env } from 'env'
import { checkAndGetTokenAsync } from 'api/auth'

export type RequestConfig = AxiosRequestConfig & { token?: string }
export const addTokenAsync = async (config: RequestConfig) => {
  if (config && config.url && config.url.startsWith(`${Env.api.base}/rest`)) {
    let token
    if (config.token) {
      token = config.token
    } else {
      token = await checkAndGetTokenAsync()
    }
    Object.assign(config, {
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    })
    return config
  }
  return config
}
