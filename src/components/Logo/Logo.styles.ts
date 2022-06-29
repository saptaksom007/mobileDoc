import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'

export default StyleSheet.create({
  container: {
    // width: 100,
  },
  logoImg: {
    // flex: 1,
    // width: undefined,
    // height: undefined,
    resizeMode: 'contain',
    width: Layout.window.width * 0.2,
  },
})
