import { StyleSheet, Platform } from 'react-native'
import { Color } from 'constants/Color'
import normalize from 'react-native-elements/src/helpers/normalizeText'

export const ICON_SIZE = normalize(30)
export const ICON_SIZE_SMALL = normalize(19)
export const ANDROID_COEFF = 1.3
export const ICON_COLOR = Color.tintColor
export const ACTIVE_OPACITY = 0.8

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: Platform.select({ android: 87, ios: 80 }),
    marginHorizontal: 8,
    overflow: 'visible',
  },
  signIn: {
    backgroundColor: 'transparent',
    paddingRight: 8,
  },
  dataSharingView: {
    padding: 12,
    backgroundColor: Color.white,
    borderRadius: 8,
    marginHorizontal: 12,
  },
})

export default styles
