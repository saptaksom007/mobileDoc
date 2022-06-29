import React, { PureComponent } from 'react'
import { View } from 'react-native'
import i18n from 'ex-react-native-i18n'
import { Paragraph } from 'components/CustomText/CustomText.component'
import { noop } from 'utilities/noop'
import styles from './EmptyList.styles'

interface Props {
  text?: string
  onPress?(): void
  show?: boolean
  testID?: string
}

class EmptyList extends PureComponent<Props> {
  static defaultProps = {
    onPress: () => {},
    show: false
  }
  render() {
    if (!this.props.show) {
      return <View />
    }
    return (
      <View
        style={styles.container}
        testID={this.props.testID}
        accessibilityLabel={this.props.testID}
      >
        <Paragraph
          style={styles.text}
          onPress={() => (this.props.onPress ? this.props.onPress() : noop())}
        >
          {this.props.text || i18n.t('global.empty')}
        </Paragraph>
      </View>
    )
  }
}

export default EmptyList
