import { StyleSheet, Platform } from 'react-native'
import {
  MEDIUM_SIZE,
  calculateLineHeight
} from 'components/CustomText/CustomText.styles'
import { Color } from 'constants/Color'

export const AVATAR_SIZE = Platform.OS === 'ios' ? 45 : 42
export const ICON_SIZE = calculateLineHeight(MEDIUM_SIZE)

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 7
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 7
  },
  titleContainer: {
    ...Platform.select({
      android: {
        marginTop: -6
      }
    })
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 2
  },
  excerpt: {
    flex: 1,
    color: Color.lightText
  },
  excerptWithIcon: {
    marginLeft: 5
  },
  badgeContainer: {
    flex: 1,
    alignItems: 'center'
  },
  fromNow: {
    color: Color.lightText,
    fontSize: 10,
    minWidth: 45
  },
  renderIconContent: {
    width: ICON_SIZE,
    height: ICON_SIZE
  },
  contentContainer: {
    flex: 7,
    paddingLeft: 4
  }
})
