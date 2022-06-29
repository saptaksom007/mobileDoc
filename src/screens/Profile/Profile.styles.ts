import { StyleSheet } from 'react-native'
import { Color } from 'constants/Color'
import { Env } from 'env'
import { fontFamilyBold } from 'components/CustomText/CustomText.styles'
import normalize from 'react-native-elements/src/helpers/normalizeText'

export default StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  welcome: {
    color: Color.black,
    fontFamily: fontFamilyBold,
    fontWeight: '900',
  },
  button: {
    marginTop: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    height: 60,
  },
  version: {
    marginTop: 15,
    textAlign: 'center',
    padding: 15,
    marginHorizontal: 15,
    color: Color.tintColor,
    backgroundColor: Color[Env.environment],
  },
  helpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  helpLinkText: {
    fontSize: normalize(13),
    lineHeight: Math.round(normalize(18)),
    fontFamily: fontFamilyBold,
  },
})
