import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
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
    marginTop: 12,
    marginBottom: 6,
    marginHorizontal: 6,
    minHeight: 60,
    borderRadius: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
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
  onPress(item: any): void
  style?: any
  isNew?: boolean
  id?: any
}

class ActivityListItem extends PureComponent<Props> {
  static defaultProps = {
    onPress: () => console.warn('Attach a method here.'),
  }
  render() {
    const { title, onPress, style, color, isNew, id } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => onPress({ isNew })}>
        <View style={[styles.container, style]}>
          {isNew && (
            <Icon
              type='ionicon'
              name='add-circle-outline'
              color={color}
              onPress={() => onPress({ isNew, id })}
            />
          )}
          {title && (
            <Heading3 style={[styles.subtitle, { color }]}>{title}</Heading3>
          )}
          {/* <TouchableOpacity onPress={() => onDeletePress({ id })}>
            <Icon type='ionicon' name='trash-outline' color={color} />
          </TouchableOpacity> */}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default ActivityListItem
