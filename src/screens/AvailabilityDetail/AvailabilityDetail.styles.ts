import { StyleSheet } from 'react-native'
import { Color } from 'constants/Color'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  cardContainerStyle: {
    margin: 20
  },
  cardTitle: {
    color: Color.lightText
  },
  cardLastItemNoBorder: {
    borderBottomWidth: 0
  }
})
