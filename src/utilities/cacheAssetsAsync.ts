import * as Font from 'expo-font'
import { Asset } from 'expo-asset'

function cacheImages(images: number[]) {
  return images.map((img: number) => Asset.loadAsync(img))
}
type FontSource = any

function cacheFonts(fonts: FontSource) {
  return fonts.map((font: string | { [name: string]: FontSource }) =>
    Font.loadAsync(font),
  )
}

interface CacheAssetsParams {
  images: number[]
  fonts: FontSource
}
export function cacheAssetsAsync({ images, fonts }: CacheAssetsParams) {
  return Promise.all([...cacheImages(images), ...cacheFonts(fonts)])
}
