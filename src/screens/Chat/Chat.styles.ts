import { StyleSheet } from 'react-native'
import { Color } from 'constants/Color'
import { Layout } from 'constants/Layout'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  name: {
    color: '#b2b2b2',
    padding: 3,
  },
  loaderTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minWidth: 14,
  },
  sendContainer: {
    height: 44,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  actionContainer: {
    height: 44,
    width: 35,
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bubbleRight: {
    padding: 5,
    backgroundColor: Color.tintColor,
  },
  bubbleLeft: {
    padding: 5,
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  chatContainer: {
    flex: 1,
  },
  metaMessageContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: -8,
    marginBottom: 10,
  },
  metaMessageWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(218, 239, 255)',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  metaMessageText: {
    backgroundColor: 'transparent',
    color: 'rgba(95, 95, 95, 0.87)',
    fontSize: 12,
    textAlign: 'center',
  },
  video: {
    width: Layout.window.width / 1.3,
    height: 200,
    margin: 5,
    borderRadius: 13,
  },
})
