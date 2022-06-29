import React, { PureComponent } from 'react'
import { View, StyleSheet, StyleProp, TextStyle } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { Heading3 } from 'components/CustomText/CustomText.component'
import { Color } from 'constants/Color'
import CustomTextStyles, {
  fontFamily,
} from 'components/CustomText/CustomText.styles'

export const buttonTextStyle = [
  CustomTextStyles.font,
  CustomTextStyles.small,
  {
    textAlign: 'center',
    paddingHorizontal: 2,
    color: Color.lightText,
  },
]

const styles = StyleSheet.create({
  subtitle: {
    marginLeft: 10,
    color: Color.black,
    fontFamily,
  },
  selectedButtonStyle: {
    backgroundColor: '#8950b7',
  },
  selectedText: {
    color: '#fff',
  },
  containerButtonStyle: {
    // borderRadius: 0,
    height: 45,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
})

interface Props {
  title: string
  values: string[]
  selectedIndex: number
  onPress(index: number): void
  style?: any
}

const OptButton = ButtonGroup as any

class Options extends PureComponent<Props> {
  static defaultProps = {
    selectedIndex: 0,
    onPress: () => console.warn('Attach a method here.'),
  }
  render() {
    const { title, values, selectedIndex, onPress, style } = this.props
    return (
      <View style={style}>
        {title && <Heading3 style={styles.subtitle}>{title}</Heading3>}
        <OptButton
          selectedButtonStyle={styles.selectedButtonStyle}
          selectedIndex={selectedIndex}
          buttons={values}
          textStyle={buttonTextStyle as StyleProp<TextStyle>}
          containerStyle={styles.containerButtonStyle}
          selectedTextStyle={styles.selectedText}
          onPress={onPress}
        />
      </View>
    )
  }
}

export default Options
