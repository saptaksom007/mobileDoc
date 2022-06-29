import React, { PureComponent } from 'react'

import { View, TextStyle } from 'react-native'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'
import { connect } from 'react-redux'
import i18n from 'ex-react-native-i18n'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { Avatar } from 'components/Avatar/Avatar.component'
import { Heading3, Small } from 'components/CustomText/CustomText.component'
import { Icon } from 'react-native-elements'

import { Color } from 'constants/Color'

import { Badge } from 'components/Badge/Badge.component'
import { momentWithLocales, getCalendarOutputFormat } from 'utilities/date'
import styles, { AVATAR_SIZE, ICON_SIZE } from './Conversation.styles'
import { Action } from 'redux'

interface Props {
  dispatch(action: Action): void
  avatarUrl?: string
  title: string
  content: string
  postedAt?: string | Date
  badgeNumber?: number
  onPress(): void
  detailNumberOfLines?: number
  titleNumberOfLines?: number
  hideAvatar?: boolean
  iconType?: string
  iconName?: string
  altAvatar?: string
  hideChevron?: boolean
}

class Conversation extends PureComponent<Props> {
  static defaultProps = {
    title: i18n.t('global.notitle'),
    detailNumberOfLines: 2,
    titleNumberOfLines: 1,
    hideAvatar: false,
    hideChevron: true
  }

  render() {
    const {
      avatarUrl,
      title,
      content,
      postedAt,
      badgeNumber,
      onPress,
      detailNumberOfLines,
      dispatch,
      hideAvatar,
      iconName,
      iconType,
      altAvatar,
      hideChevron,
      titleNumberOfLines
    } = this.props
    const excerpt = content ? content.substr(0, 140).replace(/\n/, ' ') : ''
    return (
      <TouchableNativeFeedbackSafe
        activeOpacity={0.8}
        style={{ borderWidth: 0 }}
        onPress={() =>
          onPress
            ? onPress()
            : dispatch(
                NavAction.showLocalWarning(i18n.t('alert.notImplemented'))
              )
        }
      >
        <View style={styles.container}>
          {!hideAvatar && (
            <Avatar
              name={altAvatar || title}
              style={styles.avatar}
              size={AVATAR_SIZE}
              url={avatarUrl}
            />
          )}
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Heading3 numberOfLines={titleNumberOfLines}>{title}</Heading3>
            </View>
            <View style={styles.content}>
              {iconName && (
                <Icon
                  containerStyle={styles.renderIconContent}
                  name={iconName}
                  type={iconType}
                  size={ICON_SIZE}
                  color={Color.lightText}
                />
              )}
              <Small
                style={
                  [
                    styles.excerpt,
                    iconName && styles.excerptWithIcon
                  ] as TextStyle
                }
                ellipsizeMode="tail"
                numberOfLines={detailNumberOfLines}
              >
                {excerpt}
              </Small>
            </View>
          </View>
          {postedAt && (
            <View style={styles.badgeContainer}>
              {postedAt && (
                <Small
                  style={styles.fromNow}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {momentWithLocales(postedAt).calendar(
                    undefined,
                    getCalendarOutputFormat()
                  )}
                </Small>
              )}
              {!postedAt && <Small style={styles.fromNow} />}
              {!!badgeNumber && <Badge value={badgeNumber} />}
            </View>
          )}
          {!hideChevron && (
            <Icon
              containerStyle={{ alignSelf: 'center' }}
              name={'chevron-right'}
              color={Color.tintColor}
            />
          )}
        </View>
      </TouchableNativeFeedbackSafe>
    )
  }
}

export default connect(() => ({}))(Conversation)
