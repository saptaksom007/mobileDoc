import React, { Component } from 'react'
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Icon } from 'react-native-elements'
import {
  Heading3,
  Bold,
  Paragraph,
} from 'components/CustomText/CustomText.component'

import { ChatPositionType } from 'api/types'

import styles, { DEFAULT_COLOR } from './ChatBotMessage.styles'
import { Color } from 'constants/Color'

interface Item {
  title?: string
  subtitle: string
  onPress?(): void
}

interface Props {
  items?: Item[]
  title: string
  iconName: string
  iconType: string
  iconContainerStyle?: any
  position: ChatPositionType
}

class ChatBotMessage extends Component<Props, { isLoading: boolean }> {
  state = {
    isLoading: false,
  }

  static defaultPropTypes = {
    position: 'right',
  }

  handleOnPress = (item: Item) => () => {
    const { onPress } = item
    if (onPress) {
      onPress()
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
      setTimeout(() => this.setState({ isLoading: false }), 3000)
    }
  }

  render() {
    const {
      title,
      items,
      iconName,
      iconType,
      position,
      iconContainerStyle,
    } = this.props
    return (
      <>
        <View style={styles.container}>
          {iconName && (
            <View
              style={[
                styles.iconContainer,
                iconContainerStyle,
                position === 'right' && styles.rightIcon,
              ]}
            >
              <Icon name={iconName} type={iconType} color={DEFAULT_COLOR} />
            </View>
          )}
          <View
            style={[
              styles.titleContainer,
              position === 'right' && styles.rightTitleContainer,
            ]}
          >
            <Heading3 style={styles.title}>{title}</Heading3>
          </View>
          {items &&
            items.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.itemContainer,
                  index === items.length - 1 && styles.lastItemContainer,
                ]}
              >
                {!!item.title && (
                  <Bold style={styles.itemTitle}>{item.title || ''}</Bold>
                )}
                <View style={{ flexDirection: 'row' }}>
                  <Paragraph
                    onPress={this.handleOnPress(item)}
                    style={[
                      styles.itemValue,
                      item.onPress && { textDecorationLine: 'underline' },
                    ]}
                  >
                    {item.subtitle
                      ? `${item.subtitle
                          .substr(0, 1)
                          .toUpperCase()}${item.subtitle.substr(1)}`
                      : '[no item subtitle]'}{' '}
                  </Paragraph>
                  {item.onPress && (
                    <TouchableOpacity
                      onPress={this.handleOnPress(item)}
                      hitSlop={{ top: 15, bottom: 5, right: 15 }}
                    >
                      <Icon
                        size={20}
                        name={'open-in-new'}
                        type={'material'}
                        color={DEFAULT_COLOR}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
        </View>
        {this.state.isLoading && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Color.blackTTTT,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 13,
                opacity: 0.9,
              },
            ]}
          >
            <ActivityIndicator size='small' color={Color.white} />
          </View>
        )}
      </>
    )
  }
}

export default ChatBotMessage
