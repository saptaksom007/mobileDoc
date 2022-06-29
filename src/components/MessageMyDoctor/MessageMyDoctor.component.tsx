import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { Paragraph } from 'components/CustomText/CustomText.component'
import { View, StyleProp, ViewStyle } from 'react-native'
import { Color } from 'constants/Color'
import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'
import DashboardActions from 'screens/Dashboard/Dashboard.actions'
import i18n from 'ex-react-native-i18n'
import primaryConSelector from 'common-docdok/lib/domain/messaging/selectors/primaryConSelector'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import { hasOnlyOneConversation } from 'common-docdok/lib/domain/messaging/selectors/findConversation'

import React, { PureComponent } from 'react'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'

import { getTestId } from 'utilities/environment'

import styles from './MessageMyDoctor.styles'
import { Action } from 'redux'
import { UserOrigins } from 'constants/UserOrigins'

const testIdMyDoctor = getTestId('MessageMyDoctor')

interface Props {
  primaryConversation?: any
  dispatch?(action: Action): void
  isLoggedIn?: boolean
  onlyOneConversation?: boolean
  forceConversationId?: number
  conversations?: { [id: number]: any }
  containerStyle?: StyleProp<ViewStyle>
  otherFilter(conversation: any): void
  origin?: string
}

export class MessageMyDoctor extends PureComponent<Props> {
  static defaultProps = {
    containerStyle: {},
    otherFilter: () => true,
  }

  nextRoute = (route: any) => {
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      dispatch!(route)
    } else {
      dispatch!(DashboardActions.loginWithNextRouteRequested(route))
    }
  }

  gotoChat() {
    const {
      forceConversationId,
      otherFilter,
      onlyOneConversation,
      primaryConversation,
    } = this.props
    if (forceConversationId) {
      this.nextRoute(
        ConversationsListActions.gotoChatRequested(forceConversationId),
      )
    } else if (onlyOneConversation && primaryConversation) {
      this.nextRoute(
        ConversationsListActions.gotoChatRequested(primaryConversation.id),
      )
    } else {
      this.nextRoute(NavAction.push('conversationslist', { otherFilter }))
    }
  }

  render() {
    const { isLoggedIn, containerStyle, origin } = this.props
    const isMigros = false && origin === UserOrigins.MIGROS

    if (!isLoggedIn) {
      return null
    }
    return (
      <View
        style={[styles.container, containerStyle]}
        testID={testIdMyDoctor}
        accessibilityLabel={testIdMyDoctor}
      >
        <View style={styles.textContainer}>
          <Paragraph style={styles.messageMyDoctorText} numberOfLines={2}>
            {i18n.t(
              isMigros
                ? `dashboard.messageMyDoctorMIGROS`
                : 'dashboard.messageMyDoctor',
            )}
          </Paragraph>
        </View>
        <TouchableNativeFeedbackSafe
          onPress={() => this.gotoChat()}
          activeOpacity={0.7}
        >
          <Icon name={'email'} size={55} color={Color.tintColor} />
        </TouchableNativeFeedbackSafe>
      </View>
    )
  }
}

function select(state: any): any {
  const {
    login: { isLoggedIn },
    healthrelation: { patients },
    messaging: { conversations },
  } = state

  const patient = patients.find(findPatientSelf)
  const primaryConversation =
    patient && conversations[primaryConSelector(state, patient.uuid)!]

  const onlyOneConversation = hasOnlyOneConversation(
    Object.values(conversations),
  )

  return {
    primaryConversation,
    isLoggedIn,
    patientSelf: !!patient,
    conversations,
    onlyOneConversation,
  }
}

export default connect(select)(MessageMyDoctor)
