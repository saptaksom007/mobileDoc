import React, { Component } from 'react'

import { View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'
import { connect } from 'react-redux'
import uncheckedMessages from 'common-docdok/lib/domain/messaging/selectors/uncheckedMessages'
import filters from 'common-docdok/lib/utils/filters'

import { Small } from 'components/CustomText/CustomText.component'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { Avatar } from 'components/Avatar/Avatar.component'
import { getTestId } from 'utilities/environment'
import styles, {
  ICON_COLOR,
  ICON_SIZE,
  ICON_SIZE_SMALL,
  ACTIVE_OPACITY,
} from './HeaderNavRight.styles'
import { Action } from 'redux'
import { ConversationDtoType } from 'common-docdok/lib/types'
import { GenericModal } from 'components/GenericModal/GenericModal.component'

const testIdAvatar = getTestId('header-avatar')
const testIdInfo = getTestId('info-avatar')
const testIdLogin = getTestId('header-icon-login')

interface Props {
  dispatch(action: Action): void
  avatarPicture?: string
  name: string
  isLoggedIn: boolean
  navigation?: any
  tintColor?: string | undefined
}

class NavRight extends Component<Props> {
  state = {
    visible: false,
  }
  loginAsync = async () => {
    this.props.dispatch(NavAction.navigate('login'))
  }

  render() {
    const { dispatch, avatarPicture, name, isLoggedIn } = this.props
    if (!isLoggedIn) {
      return (
        <View style={styles.signIn}>
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            onPress={this.loginAsync}
            accessibilityTraits='button'
          >
            <View testID={testIdLogin} accessibilityLabel={testIdLogin}>
              <Icon
                name='input'
                color={ICON_COLOR}
                size={ICON_SIZE_SMALL}
                onPress={this.loginAsync}
              />
              <Small>{i18n.t('login.headerIconLabel')}</Small>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <GenericModal
          visible={this.state.visible}
          body={i18n.t('dataSharing')}
          onRequestClose={() => this.setState({ visible: false })}
          onPress={() => this.setState({ visible: false })}
        />
        <View testID={testIdInfo} accessibilityLabel={testIdInfo}>
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            onPress={() => {
              this.setState({ visible: !this.state.visible })
            }}
          >
            <Icon
              name='info'
              color={ICON_COLOR}
              size={ICON_SIZE}
              onPress={() => {
                this.setState({ visible: !this.state.visible })
              }}
            />
          </TouchableOpacity>
        </View>
        <View testID={testIdAvatar} accessibilityLabel={testIdAvatar}>
          <TouchableOpacity
            activeOpacity={ACTIVE_OPACITY}
            onPress={() => dispatch(NavAction.push('profile'))}
          >
            {avatarPicture && (
              <Avatar name={name} size={ICON_SIZE} url={avatarPicture} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

function select({ profile, login: { isLoggedIn }, messaging }: any) {
  const [notificationConv] = filters
    .values(messaging.conversations)
    .filter((conv: any) => conv.type === 'NOTIFICATION')

  const numberOfNotifications = uncheckedMessages(
    messaging,
    notificationConv ? (notificationConv as ConversationDtoType).id : undefined,
  )
  return {
    isLoggedIn,
    avatarPicture: profile && profile.avatarPicture,
    name: profile && `${profile.firstName} ${profile.lastName}`,
    numberOfNotifications,
  }
}

export const HeaderNavRight = connect(select)(NavRight)
