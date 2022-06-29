import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'

export const ICON_SIZE_LARGE: number = Layout.window.height * 0.09
export const ICON_SIZE_SMALL: number = Layout.window.height * 0.03

export default StyleSheet.create({
  container: {
    width: Layout.window.width,
    height: ICON_SIZE_LARGE + 25,
    marginTop: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    height: 40
  },
  messageMyDoctorText: {
    textAlign: 'center'
  }
})
