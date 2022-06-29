import React, { PureComponent, ReactNode } from 'react'

import { Modal, View, StyleSheet } from 'react-native'
import { Text } from 'components/CustomText/CustomText.component'
import { Card, Icon, Button } from 'react-native-elements'
import { Color } from 'constants/Color'
import { getTestId } from 'utilities/environment'

import styles from './GenericModal.styles'

interface Props {
  title?: string
  body?: string
  titleOnPress?: string
  onPress?(): void
  visible?: boolean
  iconName?: string
  renderModal?(): ReactNode
  containerStyle: any
  extraData?: any,
  onRequestClose?(): void
}

export class GenericModal extends PureComponent<Props> {
  static defaultProps = {
    containerStyle: StyleSheet.create({})
  }

  renderModal() {
    const { onPress, titleOnPress, title, body, iconName } = this.props
    return (
      <Card title={title}>
        {iconName && <Icon name={iconName} size={50} />}
        <Text style={styles.body}>{body}</Text>
        <Button
          icon={{ name: 'navigate-next' }}
          backgroundColor={Color.tintColor}
          onPress={onPress!}
          buttonStyle={styles.button}
          title={titleOnPress!}
        />
      </Card>
    )
  }

  render() {
    const { visible, renderModal, containerStyle, onRequestClose } = this.props
    return (
      <Modal
        animationType={'fade'}
        visible={visible}
        transparent
        onRequestClose={() => onRequestClose && onRequestClose()}
      >
        <View
          style={[styles.container, containerStyle]}
          collapsable={false}
          accessibilityLabel={getTestId('GenericModal')}
        >
          {renderModal ? renderModal() : this.renderModal()}
        </View>
      </Modal>
    )
  }
}
