import React, { Component } from 'react'
import { InteractionManager, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import { compose } from 'recompose'
import Conversation from 'components/Conversation/Conversation.component'
import ListContainer from 'components/ListContainer/ListContainer.component'
import withoutKeyboard from 'screens/enhancers/withoutKeyboard'

import { momentWithLocales as moment } from 'utilities/date'

import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'

import i18n from 'ex-react-native-i18n'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import NotificationsActions from 'notifications/actions'

import { getTestId } from 'utilities/environment'

import Actions from './AppointmentsList.actions'
import styles from './AppointmentsList.styles'
import { Action } from 'redux'
import { filterOldAppointment } from 'api/appointments'
import { Icon } from 'react-native-elements'
import { Color } from 'constants/Color'
import BookAppointmentActions from 'screens/BookAppointment/BookAppointment.actions'

const testId = getTestId('appointmentslist')

interface Props {
  dispatch(action: Action): void
  rawList: any[]
  patientSelf: any
  navigationData: any
}

function getAppointmentContent(appointment: any) {
  switch (appointment.appointmentType) {
    case 'Schedule': {
      return i18n.t('appointmentslist.contentScheduleItem')
    }
    case 'Appointment': {
      const appointmentTime = moment(appointment.appointmentTime)
      return i18n.t('appointmentslist.contentItem', {
        hour: appointmentTime.format('LT'),
        day: appointmentTime.format('dddd'),
        date: appointmentTime.format('Do'),
        month: appointmentTime.format('MMMM'),
      })
    }

    case 'Confirmation': {
      const appointmentTime = moment(appointment.appointmentTime)
      return i18n.t('appointmentslist.contentItem', {
        hour: appointmentTime.format('LT'),
        day: appointmentTime.format('dddd'),
        date: appointmentTime.format('Do'),
        month: appointmentTime.format('MMMM'),
      })
    }

    default: {
      return ''
    }
  }
}

function getAppointmentTitle(appointment: any, patientSelf: any) {
  const name =
    patientSelf && patientSelf.uuid === appointment.healthSubjectUuid
      ? appointment.physician
      : appointment.patientName
  switch (appointment.appointmentType) {
    case 'Schedule': {
      return appointment.clinicName
    }

    case 'Appointment': {
      return `${name} - ${i18n.t('appointmentslist.reminder')}`
    }

    case 'Confirmation': {
      return `${name} - ${i18n.t('appointmentslist.confirmation')}`
    }

    default: {
      return ''
    }
  }
}

export class AppointmentsList extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { dispatch, navigationData } = this.props
      console.log('navigation is', JSON.stringify(navigationData))
      dispatch(Actions.appointmentsListRequested())
      dispatch(NotificationsActions.removeNotificationRequested('APPOINTMENT'))
    })
  }

  goToDetail = (appointment: any) => {
    const { dispatch } = this.props
    switch (appointment.appointmentType) {
      case 'Appointment': {
        dispatch(
          NavAction.push('appointment', { appointmentId: appointment.id }),
        )
        return
      }

      case 'Schedule': {
        dispatch(
          NavAction.push('scheduleappointment', {
            appointmentId: appointment.id,
          }),
        )
        return
      }

      case 'Confirmation': {
        dispatch(
          NavAction.push('appointmentconfirmation', {
            appointmentId: appointment.id,
          }),
        )
        return
      }

      default:
        dispatch(NavAction.showLocalError(i18n.t('error.default')))
        break
    }
  }

  renderRow = ({ item: appointment }: any) => {
    const { patientSelf } = this.props
    const title = getAppointmentTitle(appointment, patientSelf)
    const content = getAppointmentContent(appointment)
    return (
      <Conversation
        badgeNumber={appointment.markAsRead ? 0 : 1}
        avatarUrl={appointment.physicianAvatarPicture}
        title={title}
        altAvatar={appointment.physician}
        postedAt={appointment.createdAt}
        iconName='event'
        content={content}
        detailNumberOfLines={3}
        onPress={() => this.goToDetail(appointment)}
      />
    )
  }

  render() {
    const { rawList, dispatch, navigationData } = this.props

    return (
      <>
        <View
          style={[
            styles.padder,
            styles.eventHeader,
            {
              backgroundColor: Color.purple,
            },
          ]}
        >
          <View style={styles.row}>
            <Icon
              name='event'
              color={Color.white}
              containerStyle={{ marginLeft: 12 }}
            />
            <Text style={{ color: Color.white }}>
              {i18n.t('appointmentslist.subtitle')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              dispatch(
                BookAppointmentActions.navigateToBookAppointment(
                  navigationData?.forceConversationId ||
                    navigationData?.conversationId,
                  navigationData?.patients?.[0]?.clinicId,
                  navigationData?.scheduleAppointment,
                ),
              )
            }}
            style={[styles.fab]}
          >
            <Icon
              type='ionicon'
              name='add'
              color={Color.purple}
              iconStyle={{ fontWeight: 'bold' }}
            />
          </TouchableOpacity>
        </View>
        <ListContainer
          testID={testId}
          data={rawList}
          renderItem={this.renderRow}
        />
      </>
    )
  }
}

function select({
  appointmentslist: { rawList },
  healthrelation: { patients },
  calendarEvents: { navigationData },
}: any) {
  const patientSelf = patients.find(findPatientSelf)
  return {
    rawList: filterOldAppointment(rawList || []).sort((ap1: any, ap2: any) => {
      if (ap1.createdAt === ap2.createdAt) {
        return 0
      }
      return new Date(ap1.createdAt).getTime() >
        new Date(ap2.createdAt).getTime()
        ? -1
        : 1
    }),
    patientSelf,
    navigationData,
  }
}

export default compose<Props, any>(
  withoutKeyboard,
  connect(select),
)(AppointmentsList)
