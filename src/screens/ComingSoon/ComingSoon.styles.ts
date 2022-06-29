import { StyleSheet } from 'react-native'

import { Layout } from 'constants/Layout'

export const ICON_SIZE_SMALL: number = Layout.window.height * 0.03
export const ICON_SIZE: number = Layout.window.height * 0.05
export const ICON_SIZE_LARGE: number = Layout.window.height * 0.09
export const TITLE_SIZE: number = 15

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
