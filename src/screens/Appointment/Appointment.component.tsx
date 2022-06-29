import React, { Component } from 'react'
import { View, InteractionManager, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import { compose } from 'recompose'
import { propOr } from 'ramda'
import Clinic from 'components/Clinic/Clinic.component'
import { Avatar } from 'components/Avatar/Avatar.component'
import MessageMyDoctor from 'components/MessageMyDoctor/MessageMyDoctor.component'
import ExportAppointmentLink from 'components/ExportAppointmentLink/ExportAppointmentLink.component'
import {
  Paragraph,
  Bold,
  Medium,
} from 'components/CustomText/CustomText.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import { Card, ListItem } from 'react-native-elements'
import withSubtitle from 'screens/enhancers/withSubtitle'
import withoutKeyboard from 'screens/enhancers/withoutKeyboard'
import { withLoader } from 'screens/enhancers/withLoader'
import i18n from 'ex-react-native-i18n'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import { findConversationForHealthSubjectUuid } from 'common-docdok/lib/domain/messaging/selectors/findConversation'
import {
  momentWithLocales as moment,
  getCalendarOutputFormatWithToday,
} from 'utilities/date'

import NotificationsActions from 'notifications/actions'
import toString from 'common-docdok/lib/utils/toString'

import Actions from './Appointment.actions'

import styles from './Appointment.styles'
import { NavigationScreenProp } from 'react-navigation'
import { Action } from 'redux'
import { ConversationDtoType } from 'common-docdok/lib/types'

function getSafeFromAppointment(key: string, appointment: any): string {
  return propOr(i18n.t('global.undefined'), key, appointment)
}

function getAppointmentTime(appointment: any) {
  return moment(appointment.appointmentTime || '2017-06-19').locale(
    i18n.getFallbackLocale(),
  )
}

interface Props {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<{
    params: { appointmentId: number }
  }>
  appointment: any & {
    physician: string
    physicianAvatarPicture: string
    patientName: string
    message?: string
  }
  name: string
  patientSelf: any
  conversationId: number
}

export class Appointment extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const {
        navigation: {
          state: { params },
        },
        dispatch,
      } = this.props
      dispatch(Actions.appointmentRequested(params && params.appointmentId))
      dispatch(NotificationsActions.removeNotificationRequested('APPOINTMENT'))
    })
  }

  renderDoctorAndSchedule() {
    const { appointment } = this.props
    const appointmentTime = getAppointmentTime(appointment)
    const physician = getSafeFromAppointment('physician', appointment)
    return (
      <Medium style={styles.message}>
        <Bold>{i18n.t('appointment.card.doctor')}:</Bold> {physician}
        {'\n'}
        <Bold>{i18n.t('appointment.card.date')}:</Bold>{' '}
        {appointmentTime.format('L')}
        {'\n'}
        <Bold>{i18n.t('appointment.card.time')}:</Bold>{' '}
        {appointmentTime.format('LT')}
      </Medium>
    )
  }

  renderMessage() {
    const { appointment } = this.props
    const message = getSafeFromAppointment('message', appointment)
    return (
      <Medium style={styles.message}>
        <Bold>{i18n.t('appointment.card.message')}:</Bold> {message}
      </Medium>
    )
  }

  renderClinic() {
    const { appointment } = this.props
    const clinic = getSafeFromAppointment('clinicName', appointment)
    const street = getSafeFromAppointment('clinicStreet', appointment)
    const location = getSafeFromAppointment('clinicLocation', appointment)
    const phoneNumber = getSafeFromAppointment('clinicContact', appointment)
    return (
      <Clinic
        name={clinic}
        contact={phoneNumber}
        street={street}
        location={location}
      />
    )
  }

  render() {
    const { appointment, name, patientSelf, conversationId } = this.props

    if (!appointment) {
      return <View />
    }

    const avatar = (
      <Avatar
        name={appointment.physician}
        url={appointment.physicianAvatarPicture}
      />
    )

    const appointmentTime = getAppointmentTime(appointment)
    return (
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.messageContainer}>
          <Paragraph style={styles.message}>
            <Paragraph>
              {i18n.t('appointment.salutation', {
                name,
                default: 'Hello,',
              })}
            </Paragraph>
            {'\n'}
            {'\n'}
            {patientSelf && (
              <Paragraph>
                {i18n.t('appointment.message', {
                  physician: appointment.physician,
                  hour: appointmentTime.format('LT'),
                  day: appointmentTime.format('dddd'),
                  date: appointmentTime.format('Do'),
                  month: appointmentTime.format('MMMM'),
                  calendar: appointmentTime.calendar(
                    undefined,
                    getCalendarOutputFormatWithToday(),
                  ),
                })}
              </Paragraph>
            )}
            {!patientSelf && (
              <Paragraph>
                {i18n.t('appointment.messageProxy', {
                  physician: appointment.physician,
                  name: appointment.patientName,
                  hour: appointmentTime.format('LT'),
                  day: appointmentTime.format('dddd'),
                  date: appointmentTime.format('Do'),
                  month: appointmentTime.format('MMMM'),
                  calendar: appointmentTime.calendar(
                    undefined,
                    getCalendarOutputFormatWithToday(),
                  ),
                })}
              </Paragraph>
            )}
          </Paragraph>
        </View>
        <Card
          containerStyle={styles.cardContainerStyle}
          title={i18n.t('appointment.card.title')}
          titleStyle={styles.cardTitle}
          fontFamily={fontFamily}
        >
          <ListItem
            avatar={avatar}
            roundAvatar
            titleNumberOfLines={3}
            title={this.renderDoctorAndSchedule()}
            titleContainerStyle={styles.cardFirstItemTitle}
            hideChevron
            containerStyle={styles.cardLastItem}
          />

          <ListItem
            title={this.renderClinic()}
            titleContainerStyle={styles.cardFirstItemTitle}
            hideChevron
            containerStyle={[
              styles.cardLastItem,
              !appointment.message && styles.cardLastItemNoBorder,
            ]}
          />

          {appointment.message && (
            <ListItem
              title={this.renderMessage()}
              titleContainerStyle={styles.cardFirstItemTitle}
              hideChevron
              containerStyle={[
                styles.cardLastItem,
                styles.cardLastItemNoBorder,
              ]}
            />
          )}
        </Card>
        <View style={styles.bottomLinks}>
          <MessageMyDoctor
            containerStyle={styles.messageMyDoctor}
            forceConversationId={conversationId}
          />
          <ExportAppointmentLink appointment={appointment} />
        </View>
      </ScrollView>
    )
  }
}

function select({
  appointment: { data },
  profile,
  healthrelation: { patients },
  messaging: { conversations },
}: any): any {
  const patientSelf = patients.find(findPatientSelf)
  const name = (profile && ` ${toString.person(profile)}`) || ''
  const appointment = data

  const conversationsArray = Object.values(
    conversations,
  ) as ConversationDtoType[]
  const conversation: any =
    appointment &&
    conversationsArray.find(
      findConversationForHealthSubjectUuid(appointment.healthSubjectUuid),
    )

  return {
    appointment,
    name,
    conversationId: conversation && conversation.id,
    patientSelf:
      patientSelf &&
      appointment &&
      appointment.healthSubjectUuid === patientSelf.uuid,
  }
}

export default compose<Props, any>(
  withoutKeyboard,
  connect(select),
  withLoader,
  withSubtitle('appointment.subtitle'),
)(Appointment)
