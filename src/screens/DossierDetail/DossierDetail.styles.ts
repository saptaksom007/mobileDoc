import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'

export default StyleSheet.create({
  container: {
    marginBottom: 15,
    height: Layout.window.height / 1.25
  },
  button: {
    marginTop: 15
  },
  bottomLinks: {
    flexDirection: 'row',
    width: Layout.window.width,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    marginTop: 15,
    paddingTop: 0,
    bottom: 0
  },
  messageMyDoctor: {
    marginTop: 0,
    width: undefined,
    height: undefined
  }
})
