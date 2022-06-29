import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'

export default StyleSheet.create({
  container: {
    height: Layout.window.height
  },
  messageContainer: {
    backgroundColor: '#fff',
    marginTop: 25,
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  scheduleMessage: {
    textAlign: 'left'
  },
  cardContainerStyle: {
    marginTop: 10
  },
  cardTitle: {
    color: Color.lightText
  },
  cardMessage: {
    textAlign: 'center',
    width: 200,
    alignSelf: 'center'
  },
  cardLastItem: {
    paddingTop: 5,
    paddingBottom: 5
  },
  cardLastItemNoBorder: {
    borderBottomWidth: 0
  },
  bottomLinks: {
    padding: 20
  }
})
