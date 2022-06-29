import { StyleSheet, Platform } from 'react-native'
import normalize from 'react-native-elements/src/helpers/normalizeText'

import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'
import { calculateLineHeight } from 'components/CustomText/CustomText.styles'

export const ICON_SIZE_SMALL: number = Layout.window.height * 0.03
export const ICON_SIZE: number = Layout.window.height * 0.05
export const ICON_SIZE_LARGE: number = Layout.window.height * 0.09
export const TITLE_SIZE: number = 15

export default StyleSheet.create({
  bg: {
    height: Layout.window.height,
    width: Layout.window.width,
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    // backgroundColor: 'aliceblue',
    marginBottom: 50,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  boxParentContainer: {
    overflow: 'hidden',
    paddingTop: Layout.window.width * 0.04,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.window.width * 0.05,
    paddingBottom: Layout.window.width * 0.01,
    // backgroundColor: 'aliceblue',
  },
  boxContainer: {
    width: Layout.window.width * 0.25,
    height: Layout.window.width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.window.width * 0.25,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: Layout.window.height * 0.02,
    // paddingHorizontal: 10,
    // borderBottomColor: Color.borderColor,
    // borderBottomWidth: 1,
    // borderBottomLeftRadius: 18,
    // borderBottomRightRadius: 18,
    // borderTopRightRadius: 18,
    // borderTopLeftRadius: 18,
    // backgroundColor: Color.white,
    // shadowColor: Color.black,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 5,
  },
  boxIcon: {
    width: '50%',
  },
  boxTitle: {
    textAlign: 'center',
    width: '100%',
    color: Color.black,
    fontSize: normalize(TITLE_SIZE),
    lineHeight: calculateLineHeight(TITLE_SIZE),
    paddingVertical: 12,
  },
  boxBadge: {
    width: '10%',
  },
  bottomLinks: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    bottom: Platform.select({
      ios: 0,
      android: 50,
    }),
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 30,
  },
  messageMyDoctor: {
    marginTop: 0,
    width: undefined,
    height: undefined,
  },
  badgeView: { position: 'absolute', top: 12, right: 4 },
})
