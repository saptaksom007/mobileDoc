import { StyleSheet } from 'react-native'
import { fontFamily } from 'components/CustomText/CustomText.styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginVertical: 100,
    marginHorizontal: 30,
    fontFamily,
  },
  version: {
    position: 'absolute',
    bottom: 15,
    color: '#bbb',
    fontSize: 10,
  },
})
