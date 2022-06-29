import { isNil, curry, reject } from 'ramda'
import { setLocalStorage } from 'common-docdok/lib/utils/localStorage'
import * as SecureStore from 'expo-secure-store'
import { AsyncStorage } from 'react-native'
// @ts-ignore
import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking'

import { REMEMBER_ME_KEY } from 'common-docdok/lib/domain/user/sagas/profile'
import PersistStore from 'common-docdok/lib/configuration/persistStore'
import {
  LIMITED_ACCESS_TOKEN_KEY,
  LIMITED_ACCESS_TOKEN_EXP_KEY,
  TOKEN_KEY,
} from 'config/auth'
import { unreadable, readable } from 'common-docdok/lib/utils/crypto'

/**
 * Curry of the setItem function
 * @param {string} key
 * @param {string} value
 * @return {Promise<void>}
 */
export const setStorageItem = curry((key: string, value: string) =>
  AsyncStorage.setItem(key, value),
)

/**
 * getItem function
 * @param {string} key
 * @param {string} value
 * @return {Promise<string | null>}
 */
export const getStorageItem = (key: string): Promise<string | null> =>
  AsyncStorage.getItem(key)

export const deleteStorageItem = (key: string) => AsyncStorage.removeItem(key)
/**
 * Curry of the setItem function
 * @param {string} key
 * @param {string} value
 * @return {Promise<void>}
 */
export const setSecureStoreItem = curry((key: string, value: string) =>
  SecureStore.setItemAsync(key, value).catch(() =>
    setStorageItem(key, unreadable(value)),
  ),
)

export const setStorageItemEncrypted = (key: string, value: string) =>
  setSecureStoreItem(key, value)

// LocalStorage getter
export const getStorageItemDecrypted = (key: string) =>
  SecureStore.getItemAsync(key).catch(() =>
    getStorageItem(key).then(s => readable(s as string)),
  )

const keys: string[] = [
  PersistStore.getCurrentLocalStorageKey(),
  LIMITED_ACCESS_TOKEN_KEY,
  LIMITED_ACCESS_TOKEN_EXP_KEY,
  REMEMBER_ME_KEY,
  TOKEN_KEY,
]

export const clearCookiesAsync = () =>
  new Promise((resolve: any) => {
    RCTNetworking.clearCookies((cleared: any) => resolve(cleared))
  })

export const clearStorageAsync = async () => {
  await Promise.all(
    reject(isNil, keys).map((k: any) => SecureStore.deleteItemAsync(k)),
  )
  await AsyncStorage.clear()

  await clearCookiesAsync()
  return true
}

export const deleteStorageItemAsync = SecureStore.deleteItemAsync

export const AppStorage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  clear: clearStorageAsync,
  key: (index: number) => Promise.resolve(keys[index]),
  length: () => Promise.resolve(keys.length),
  removeItem: AsyncStorage.removeItem,
}

/**
 * Sets the implementation for the localstorage in the common
 */
export const setLocalStorageImpl = () => setLocalStorage(AppStorage)
