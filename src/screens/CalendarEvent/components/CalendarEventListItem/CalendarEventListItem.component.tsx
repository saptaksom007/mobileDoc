import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { Heading3 } from 'components/CustomText/CustomText.component'
import { Color } from 'constants/Color'
import CustomTextStyles from 'components/CustomText/CustomText.styles'
import { Icon } from 'react-native-elements'

export const buttonTextStyle = [
  CustomTextStyles.font,
  CustomTextStyles.small,
  {
    textAlign: 'center',
    paddingHorizontal: 2,
  },
]

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    minHeight: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: Color.white,
  },
  selectedButtonStyle: {
    backgroundColor: Color.tintColor,
  },
  selectedText: {
    color: '#fff',
  },
  containerButtonStyle: {
    borderRadius: 0,
    height: 45,
  },
})

interface Props {
  title: string
  color?: string
  image?: string
  onPress(index: number): void
  style?: any
}

class CalendarEventListItem extends PureComponent<Props> {
  static defaultProps = {
    onPress: () => console.warn('Attach a method here.'),
  }
  render() {
    const { title, image, onPress, style, color } = this.props
    console.log({ image, onPress, color })
    return (
      <View style={[styles.container, style]}>
        <Icon type='ionicon' name='add-circle-outline' color={Color.white} />
        {title && <Heading3 style={styles.subtitle}>{title}</Heading3>}
      </View>
    )
  }
}

export default CalendarEventListItem
