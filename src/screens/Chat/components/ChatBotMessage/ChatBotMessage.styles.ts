import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'
import { fontFamilyBold as fontFamily } from 'components/CustomText/CustomText.styles'

export const DEFAULT_COLOR = 'rgba(95, 95, 95, 0.87)'
export const DEFAULT_BACKGROUND = 'rgb(218, 239, 255)'
export const DEFAULT_WIDTH = Layout.window.width / 1.4
export const ICON_SIZE = 30
export const DEFAULT_BORDER_RADIUS = 5

export default StyleSheet.create({
  container: {
    width: DEFAULT_WIDTH,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DEFAULT_BORDER_RADIUS,
    borderColor: '#fff',
    borderWidth: 2,
    top: 10,
    left: -1,
    zIndex: 1,
    backgroundColor: DEFAULT_BACKGROUND,
  },
  titleContainer: {
    backgroundColor: DEFAULT_BACKGROUND,
    marginVertical: 1,
    paddingVertical: 12,
    paddingHorizontal: 7,
    borderTopRightRadius: DEFAULT_BORDER_RADIUS,
  },
  rightTitleContainer: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: DEFAULT_BORDER_RADIUS,
  },
  title: {
    textAlign: 'left',
    color: DEFAULT_COLOR,
    fontFamily,
  },
  itemContainer: {
    backgroundColor: DEFAULT_BACKGROUND,
    marginBottom: 1,
    padding: 7,
  },
  lastItemContainer: {
    borderBottomLeftRadius: DEFAULT_BORDER_RADIUS,
    borderBottomRightRadius: DEFAULT_BORDER_RADIUS,
  },
  itemTitle: {
    color: DEFAULT_COLOR,
    fontSize: 13,
  },
  itemValue: {
    paddingTop: 4,
    paddingBottom: 2,
    color: DEFAULT_COLOR,
  },
  rightIcon: {
    left: DEFAULT_WIDTH - ICON_SIZE + 1,
  },
})
