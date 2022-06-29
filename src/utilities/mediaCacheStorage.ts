import * as FileSystem from 'expo-file-system'
import invariant from 'invariant'
import { last } from 'ramda'
import { setMediaCacheDefaultStorage } from 'common-docdok/lib/utils/mediaCache'

let fs: any

export const SUBFOLDER_CACHE = 'mediaCacheStorage'
const getDirUri = () => `${fs.documentDirectory}${SUBFOLDER_CACHE}`
const initialized = {
  done: false,
  error: {
    message: `${SUBFOLDER_CACHE} folder is not created`,
  },
}

const fileUri = (key: string) => `${getDirUri()}/${key}`

const getKeysAsync = () => fs.readDirectoryAsync(getDirUri())

export const mediaCacheStorage: any = {
  setItem: (key: string, value: string) => {
    invariant(value, 'should not be null')
    return fs.writeAsStringAsync(fileUri(key), value)
  },
  getItem: (key: string) => {
    return fs.readAsStringAsync(fileUri(key))
  },
  key: async (index: number) => {
    const keys: string[] = await getKeysAsync()
    keys.sort()
    return last(keys[index].split('/'))
  },
  removeItem: (key: string) => {
    return fs.deleteAsync(fileUri(key))
  },
  clear: async () => {
    await fs.deleteAsync(getDirUri())
    await fs.makeDirectoryAsync(getDirUri())
    return true
  },
  length: async () => {
    const keys = await getKeysAsync()
    return keys.length
  },
}

export const initMediaCacheStorageAsync = async (
  fileSystem: any = FileSystem,
) => {
  fs = fileSystem
  const { exists } = await fs.getInfoAsync(getDirUri())
  if (!exists) {
    await fs.makeDirectoryAsync(getDirUri())
  }
  setMediaCacheDefaultStorage(mediaCacheStorage)
  initialized.done = true
}
