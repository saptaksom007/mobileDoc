import { omit } from 'ramda'
import {
  initMediaCacheStorageAsync,
  SUBFOLDER_CACHE,
  mediaCacheStorage,
} from '../mediaCacheStorage'

let storage: { [key: string]: string } = {}
const dummyStore = {
  documentDirectory: 'documentDirectory/',
  getInfoAsync(uri: string) {
    expect(uri).toBeDefined()
    return new Promise((resolve: any) => resolve({ exist: false }))
  },
  writeAsStringAsync(key: string, value: string) {
    storage[key] = value
    return Promise.resolve()
  },
  readAsStringAsync(key: string) {
    return Promise.resolve(storage[key])
  },
  makeDirectoryAsync(uri: string) {
    expect(uri).toBeDefined()
    return Promise.resolve()
  },
  readDirectoryAsync(uri: string) {
    expect(uri).toBeDefined()
    return Promise.resolve(Object.keys(storage))
  },
  deleteAsync(uri: string) {
    if (`documentDirectory/${SUBFOLDER_CACHE}` === uri) {
      storage = {}
    } else {
      storage = omit([uri], storage)
    }
    return Promise.resolve()
  },
}

beforeAll(() => initMediaCacheStorageAsync(dummyStore))

describe('mediaCacheStorage', () => {
  it('should set item', async () => {
    await mediaCacheStorage.setItem('test', 'test')
    expect(storage['documentDirectory/mediaCacheStorage/test']).toBe('test')
  })
  it('should get item', async () => {
    const item = await mediaCacheStorage.getItem('test')
    expect(item).toBe('test')
  })
  it('should execute key function', async () => {
    const key_0 = await mediaCacheStorage.key(0)
    expect(key_0).toBe('test')
  })
  it('should execute key function', async () => {
    const key_0 = await mediaCacheStorage.key(0)
    expect(key_0).toBe('test')
  })
  it('should remove item', async () => {
    await mediaCacheStorage.removeItem('test')
    expect(storage).toEqual({})
  })
  it('should get length', async () => {
    await mediaCacheStorage.setItem('test', 'test')
    await mediaCacheStorage.setItem('test2', 'test2')
    const length = await mediaCacheStorage.length()
    expect(length).toBe(2)
  })
  // it('should clear', async () => {
  //   await mediaCacheStorage.clear()
  //   const length = await mediaCacheStorage.length()
  //   expect(length).toBe(0)
  //   expect(storage).toEqual({})
  // })
})
