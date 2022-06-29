import { StyleSheet } from 'react-native'
import { Layout } from 'constants/Layout'
import { SUBTITLE_HEIGHT } from 'components/Subtitle/Subtitle.styles'
import { Color } from 'constants/Color'

export default StyleSheet.create({
  container: {
    height: Layout.window.height - SUBTITLE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: Color.lightText,
    marginTop: -SUBTITLE_HEIGHT
  }
})
