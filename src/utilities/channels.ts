import Constants from 'expo-constants'
import ApiEnvUrl from 'config/api.json'

export type Channel = 'qa' | 'it' | 'stage' | 'production' | 'demo1' | 'demo2'
export const getChannel = (): Channel =>
  (Constants.manifest.releaseChannel || 'default') as Channel

export const getEnvFromChannel = (channel: Channel = 'qa'): Channel => {
  const splittedChannel = channel.split('-')[0]
  if (Object.keys(ApiEnvUrl).includes(splittedChannel)) {
    return splittedChannel as any
  }
  // 'qa' is always the default one
  return 'production'
}
