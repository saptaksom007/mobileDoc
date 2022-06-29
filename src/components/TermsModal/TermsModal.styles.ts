import { StyleSheet, Platform } from 'react-native'
import { Layout } from 'constants/Layout'

import { SHADOW_HEIGHT } from 'components/Subtitle/Subtitle.styles'
import { Color } from 'constants/Color'

const HEADER_HEIGHT = Layout.window.height / 7

export const getHeaderHeightWhenChanged = () => Layout.window.height / 10

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: Layout.window.width,
    height: Layout.window.height,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 0,
    marginTop: 22,
    marginBottom: 4,
  },
  imageContainerStyle: {},
  linearGradient: {
    height: SHADOW_HEIGHT,
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(117, 117, 117, 0.4)',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    opacity: 0.98,
    height: Platform.select({
      ios: Layout.window.height / 3,
      android: Layout.window.height / 2.2,
    }),
  },
  button: {
    width: Layout.window.width / 3,
    height: 30,
    padding: undefined,
    paddingVertical: 5,
    opacity: 1,
  },
  change: {
    color: Color.warningText,
  },
  changeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.warningBackground,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
    paddingVertical: 4,
  },
  agreeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  agreeButtonContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  consent: {
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
  consentLink: {
    textDecorationLine: 'underline',
  },
  closeButton: {
    height: Layout.window.height / 9,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  declineText: {
    color: Color.tintColor,
    textAlign: 'center',
  },
})
