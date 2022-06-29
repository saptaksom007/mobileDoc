import { StyleSheet, Platform } from 'react-native'
import normalize from 'react-native-elements/src/helpers/normalizeText'

export default StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: normalize(10),
    width: normalize(20),
    height: normalize(20),
    zIndex: 1000
  },
  badgeText: {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    lineHeight: Math.round(normalize(20)),
    ...Platform.select({
      android: {
        marginLeft: -1,
        fontSize: normalize(11)
      },
      ios: {
        fontSize: normalize(12)
      }
    })
  },
  emptyBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: normalize(20),
    height: normalize(20)
  }
})
