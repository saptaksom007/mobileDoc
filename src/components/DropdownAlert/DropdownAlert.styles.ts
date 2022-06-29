import { Platform } from 'react-native'
import {
  fontFamily,
  fontFamilyBold
} from 'components/CustomText/CustomText.styles'

export const container = {
  padding: 8,
  paddingBottom: Platform.select({ ios: 25, android: 45 }),
  paddingTop: Platform.select({ ios: 20, android: 0 }),
  flexDirection: 'row'
}

export const message = {
  fontFamily,
  color: '#fff',
  fontSize: 14,
  textAlign: 'left',
  fontWeight: 'bold',
  backgroundColor: 'transparent'
}

export const title = {
  fontFamily: fontFamilyBold,
  color: '#fff',
  fontSize: 16,
  textAlign: 'left',
  fontWeight: 'bold',
  backgroundColor: 'transparent'
}
