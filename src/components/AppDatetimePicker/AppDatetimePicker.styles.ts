import { Color } from 'constants/Color'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
  },
  input: {
    flex: 10,
    height: 32,
    fontSize: 18,
    color: Color.blackTT,
  },
  icon: {
    flex: 1,
    height: 24,
    width: 24,
  },
  error: {
    color: Color.errorBackground,
  },
  label: {
    marginTop: 12,
  },
})
