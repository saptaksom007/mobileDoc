import { StyleSheet } from 'react-native'
import { Color } from 'constants/Color'
import {
  fontFamilyBold,
  fontFamily
} from 'components/CustomText/CustomText.styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  listContainer: {
    backgroundColor: '#fff',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  itemContainerStyle: { borderBottomColor: Color.borderColor },
  itemTitleStyle: { color: Color.darkText, fontFamily: fontFamilyBold },
  itemSubtitleStyle: { color: Color.lightText, fontFamily }
})
