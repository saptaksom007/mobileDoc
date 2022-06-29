import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'
import normalize from 'react-native-elements/src/helpers/normalizeText'

export const TEXT_HEIGHT = 40
export const SHADOW_HEIGHT = 0
export const SUBTITLE_HEIGHT = TEXT_HEIGHT + SHADOW_HEIGHT
export const NORMAL_FONT = normalize(14)
export const SMALL_FONT = normalize(12)

export default StyleSheet.create({
  container: {
    width: Layout.window.width,
    height: SUBTITLE_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      width: StyleSheet.hairlineWidth,
      height: StyleSheet.hairlineWidth
    },
    elevation: 4,
    zIndex: 1000
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.borderColor,
    height: TEXT_HEIGHT,
    width: Layout.window.width
  },
  subtitleText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: NORMAL_FONT,
    backgroundColor: 'transparent'
  }
})
