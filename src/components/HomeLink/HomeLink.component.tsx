

import React, { PureComponent } from 'react'

import { Color } from 'constants/Color'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Paragraph } from 'components/CustomText/CustomText.component'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'
import styles from './HomeLink.styles'

interface Props {
  title: string,
  onPress(): void,
  iconName: string,
  testID?: string,
  iconType: string
}

class HomeLink extends PureComponent<Props> {
  static defaultProps = {
    iconType: 'material'
  }
  render() {
    const { title, onPress, iconName, iconType, testID } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Paragraph style={styles.text}>{title}</Paragraph>
        </View>
        <View testID={testID} accessibilityLabel={testID}>
          <TouchableNativeFeedbackSafe onPress={onPress} activeOpacity={0.7}>
            <Icon
              name={iconName}
              type={iconType}
              size={50}
              color={Color.tintColor}
            />
          </TouchableNativeFeedbackSafe>
        </View>
      </View>
    )
  }
}

export default HomeLink
