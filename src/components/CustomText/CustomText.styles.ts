import { StyleSheet, Platform } from 'react-native'

import { Color } from 'constants/Color'

import normalize from 'react-native-elements/src/helpers/normalizeText'

export const LINE_HEIGTH_MULTIPLICATOR: number =
  Platform.OS === 'ios' ? 1.2 : 1.45

export const H1_SIZE: number = 24
export const H2_SIZE: number = 20
export const H3_SIZE: number = 14.5
export const P_SIZE: number = 14
export const MEDIUM_SIZE: number = 13.5
export const SMALL_SIZE: number = 12

export const fontFamily = 'TitilliumWeb-Regular'
export const fontFamilyBold = 'TitilliumWeb-SemiBold'

export const calculateLineHeight = (fontTypeSize: number) =>
  Math.round(normalize(fontTypeSize * LINE_HEIGTH_MULTIPLICATOR))

const styles = StyleSheet.create({
  font: {
    fontFamily,
    overflow: 'visible',
    fontSize: normalize(P_SIZE),
    lineHeight: calculateLineHeight(H3_SIZE),
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center'
      }
    })
  },
  h1: {
    fontFamily: fontFamilyBold,
    fontSize: normalize(H1_SIZE),
    lineHeight: calculateLineHeight(H1_SIZE),
    color: Color.darkText
  },
  h2: {
    fontFamily: fontFamilyBold,
    fontSize: normalize(H2_SIZE),
    lineHeight: calculateLineHeight(H2_SIZE),
    color: Color.darkText
  },
  h3: {
    fontFamily: fontFamilyBold,
    fontSize: normalize(H3_SIZE),
    lineHeight: calculateLineHeight(H3_SIZE),
    color: Color.darkText
  },
  p: {
    fontSize: normalize(P_SIZE),
    lineHeight: calculateLineHeight(P_SIZE),
    color: Color.darkText
  },
  small: {
    fontSize: normalize(SMALL_SIZE),
    lineHeight: calculateLineHeight(SMALL_SIZE),
    color: Color.darkText
  },
  medium: {
    fontSize: normalize(MEDIUM_SIZE),
    lineHeight: calculateLineHeight(MEDIUM_SIZE),
    color: Color.darkText
  },
  bold: {
    fontFamily: fontFamilyBold,
    color: Color.darkText
  }
})

export default styles
