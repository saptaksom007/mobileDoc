import React, { Component } from 'react'

import { View, InteractionManager } from 'react-native'
import { Icon } from 'react-native-elements'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'
import { connect } from 'react-redux'
import EmptyList from 'components/EmptyList/EmptyList.component'
import ListContainer from 'components/ListContainer/ListContainer.component'
import i18n from 'ex-react-native-i18n'
import { decodeText } from 'utilities/html'
import { compose } from 'recompose'
import { propOr } from 'ramda'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import filters from 'common-docdok/lib/utils/filters'
import Conversation from 'components/Conversation/Conversation.component'
import withSubtitle from 'screens/enhancers/withSubtitle'
import withoutKeyboard from 'screens/enhancers/withoutKeyboard'
import dateUtil from 'common-docdok/lib/utils/dateUtils'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import { withLoader } from 'screens/enhancers/withLoader'
import { getTestId } from 'utilities/environment'
import { Color } from 'constants/Color'
import { getSurveyUrlById } from 'utilities/survey'

import styles from './NotificationsList.styles'
import { Action } from 'redux'

const testIdNotificationsList = getTestId('notifications-list')

interface Props {
  notificationsList: any[]
  dispatch(action: Action): void
  surveyDefinitionsById: { [id: number]: any }
  users: any
  notificationId: number
  appointments: {
    [id: number]: any & { physicianAvatarPicture?: string }
  }
}

export class NotificationsList extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { dispatch, notificationId } = this.props
      dispatch(messagingActions.loadMessagesRequested(notificationId))
    })
  }

  getAppointmentTitle = (
    appointmentType: 'Appointment' | 'Schedule' | 'Confirmation'
  ) => {
    switch (appointmentType) {
      case 'Appointment': {
        return i18n.t('appointment.subtitle')
      }
      case 'Schedule': {
        return i18n.t('scheduleAppointment.subtitle')
      }
      case 'Confirmation': {
        return i18n.t('appointmentConfirmation.subtitle')
      }
      default: {
        return i18n.t('appointment.subtitle')
      }
    }
  }

  dissmissAll = () => {
    const { dispatch, notificationsList } = this.props
    dispatch(messagingActions.markAsCheckedRequested(notificationsList, true))
  }

  selectNotification(notification: any) {
    const { dispatch } = this.props
    switch (notification.meta.notificationtype) {
      case 'SURVEY': {
        const url = getSurveyUrlById(notification.meta.id)
        dispatch(NavAction.push('surveywebview', { url }))
        break
      }

      case 'APPOINTMENT': {
        const appointmentId = notification.meta.appointmentId
        const { appointmentType } = notification.meta
        switch (appointmentType) {
          case 'Appointment': {
            dispatch(NavAction.push('appointment', { appointmentId }))
            return
          }
          case 'Schedule': {
            dispatch(NavAction.push('scheduleappointment', { appointmentId }))
            return
          }
          case 'Confirmation': {
            dispatch(
              NavAction.push('appointmentconfirmation', { appointmentId })
            )
            return
          }
          default:
            dispatch(NavAction.showLocalWarning(i18n.t('alert.notImplemented')))
            return
        }
      }

      default: {
        dispatch(NavAction.showLocalWarning(i18n.t('alert.notImplemented')))
      }
    }
  }

  renderSurveyNotification(notification: any) {
    const { users } = this.props
    const user = users[notification.userRef]
    const avatarUrl = user && user.avatarPicture

    const surveyName =
      notification.meta.surveyName || decodeText(notification.text)

    const content =
      notification.meta.subtype === 'SURVEY_REMINDER'
        ? i18n.t('notificationslist.surveyReminder', {
          content: surveyName
        })
        : i18n.t('notificationslist.survey', {
          content: surveyName
        })
    return (
      <Conversation
        iconName="show-chart"
        avatarUrl={user && avatarUrl}
        title={user && `${user.firstName} ${user.lastName}`}
        detailNumberOfLines={5}
        content={content}
        postedAt={dateUtil.toDate(notification.postedAt)}
        onPress={() => this.selectNotification(notification)}
      />
    )
  }

  renderAppointmentNotification(notification: any) {
    const { appointments } = this.props
    const appointment = appointments[notification.meta.appointmentId]
    if (!appointment) {
      return null
    }
    const { appointmentType } = notification.meta
    return (
      <Conversation
        iconName="event"
        avatarUrl={appointment && appointment.physicianAvatarPicture}
        title={this.getAppointmentTitle(appointmentType)}
        detailNumberOfLines={2}
        content={notification.text}
        postedAt={dateUtil.toDate(notification.postedAt)}
        onPress={() => this.selectNotification(notification)}
      />
    )
  }

  renderDefault(notification: any) {
    const { users } = this.props
    const user = users[notification.userRef]
    const avatarUrl = user && user.avatarPicture
    const firstName = user && user.firstName
    const lastName = user && user.lastName

    return (
      <Conversation
        iconName="notifications"
        avatarUrl={avatarUrl}
        title={`${firstName || ''} ${lastName || ''}`}
        content={notification.text && decodeText(notification.text)}
        postedAt={dateUtil.toDate(notification.postedAt)}
        onPress={() => this.selectNotification(notification)}
      />
    )
  }

  renderRow = ({ item: rowData }: any) => {
    switch (rowData.meta.notificationtype) {
      case 'SURVEY': {
        return this.renderSurveyNotification(rowData)
      }

      case 'APPOINTMENT': {
        return this.renderAppointmentNotification(rowData)
      }

      default:
        return this.renderDefault(rowData)
    }
  }

  render() {
    const { dispatch, notificationsList } = this.props

    if (!notificationsList || notificationsList.length === 0) {
      return (
        <EmptyList
          testID={testIdNotificationsList}
          text={i18n.t('notificationslist.empty')}
          show
          onPress={() => dispatch(messagingActions.getSubscriptionsRequested())}
        />
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <TouchableNativeFeedbackSafe
            style={styles.dismiss}
            onPress={this.dissmissAll}
          >
            <Icon name="delete" color={Color.darkText} />
          </TouchableNativeFeedbackSafe>
        </View>

        <ListContainer
          testID={testIdNotificationsList}
          data={notificationsList}
          renderItem={this.renderRow}
        />
      </View>
    )
  }
}

function select({
  survey: { surveyDefinitionsById },
  userCache: { users },
  messaging: { conversations, checkedMessages },
  appointmentslist: { rawList: appointments }
}: any) {
  const notificationConv = filters
    .values(conversations)
    .filter((conv: any) => conv.type === 'NOTIFICATION')[0]

  const notificationId: string = propOr(0, 'id', notificationConv)
  const messages: any[] = propOr([], 'messages', notificationConv)
  const latestCheckedMessage: any[] = propOr(0, notificationId, checkedMessages)

  const notificationsList = messages
    .filter(
      (m: any) =>
        latestCheckedMessage.length === 0 || m.sequenceNo > latestCheckedMessage
    )
    .sort((m1: any, m2: any) => m2.sequenceNo - m1.sequenceNo)

  return {
    notificationsList,
    surveyDefinitionsById,
    users,
    notificationId,
    appointments:
      appointments &&
      appointments.reduce(
        (prev: any, curr: any) => ({ ...prev, [curr.id]: curr }),
        {}
      )
  }
}

export default compose<Props, any>(
  withoutKeyboard,
  connect(select),
  withLoader,
  withSubtitle('notificationslist.subtitle')
)(NotificationsList)
