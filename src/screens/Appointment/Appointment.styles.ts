import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'

export default StyleSheet.create({
  contentContainerStyle: {
    height: Layout.window.height
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  messageContainer: {
    backgroundColor: '#fff',
    marginTop: 25,
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  message: {
    textAlign: 'left'
  },
  cardContainerStyle: {
    marginTop: 10
  },
  cardTitle: {
    color: Color.lightText
  },
  cardLastItem: {
    paddingTop: 5,
    paddingBottom: 5
  },
  cardLastItemNoBorder: {
    borderBottomWidth: 0
  },
  cardFirstItemTitle: {
    marginHorizontal: 10
  },
  messageMyDoctor: {
    marginTop: 0,
    width: undefined,
    height: undefined
  },
  bottomLinks: {
    flexDirection: 'row',
    width: Layout.window.width,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30
  }
})
