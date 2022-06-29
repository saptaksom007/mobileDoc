import React, { Component } from 'react'
import { compose } from 'recompose'
import { propOr } from 'ramda'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { Card, ListItem } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'
import toString from 'common-docdok/lib/utils/toString'
import {
  momentWithLocales as moment,
  getCalendarOutputFormatWithToday
} from 'utilities/date'

import MessageMyDoctor from 'components/MessageMyDoctor/MessageMyDoctor.component'
import { Avatar } from 'components/Avatar/Avatar.component'
import ExportAppointmentLink from 'components/ExportAppointmentLink/ExportAppointmentLink.component'
import Clinic from 'components/Clinic/Clinic.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import {
  Paragraph,
  Bold,
  Medium
} from 'components/CustomText/CustomText.component'

import withSubtitle from 'screens/enhancers/withSubtitle'
import Actions from './AppointmentConfirmation.actions'
import styles from './AppointmentConfirmation.styles'
import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'

interface Props {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<any>
  name: string
  appointment: any & { physicianAvatarPicture: string }
  conversationId: number
}

function getSafeFromAppointment(key: string, appointment: any) {
  return propOr<string, any, string>(
    i18n.t('global.undefined'),
    key,
    appointment
  )
}

function getAppointmentTime(appointment: any) {
  return moment(appointment.appointmentTime || '2017-06-19').locale(
    i18n.getFallbackLocale()
  )
}

export class AppointmentConfirmation extends Component<Props> {
  componentDidMount() {
    const {
      navigation: {
        state: { params }
      },
      dispatch
    } = this.props

    dispatch(
      Actions.appointmentConfirmationRequested(params && params.appointmentId)
    )
    dispatch(
      Actions.markAsReadAppointmentConfirmation(params && params.appointmentId)
    )
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

  renderClinic() {
    const { appointment } = this.props
    const clinic = getSafeFromAppointment('clinicName', appointment)
    const street = getSafeFromAppointment('clinicStreet', appointment)
    const location = getSafeFromAppointment('clinicLocation', appointment)
    const phoneNumber = getSafeFromAppointment('clinicContact', appointment)
    return (
      <Clinic name={clinic} contact={phoneNumber} {...{ street, location }} />
    )
  }

  render() {
    const { name, appointment, conversationId } = this.props

    if (!appointment) {
      return null
    }

    const appointmentTime = getAppointmentTime(appointment)
    const avatar = (
      <Avatar
        name={appointment.physician}
        url={appointment.physicianAvatarPicture}
      />
    )

    return (
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.messageContainer}>
          <Paragraph style={styles.message}>
            <Paragraph>
              {i18n.t('appointment.salutation', {
                name,
                default: 'Hello,'
              })}
            </Paragraph>
            {'\n'}
            {'\n'}
            <Paragraph>
              {i18n.t('appointmentConfirmation.message', {
                date: appointmentTime.format('Do'),
                day: appointmentTime.format('dddd'),
                hour: appointmentTime.format('LT'),
                month: appointmentTime.format('MMMM'),
                calendar: appointmentTime.calendar(
                  undefined,
                  getCalendarOutputFormatWithToday()
                ),
                physician: appointment.physician
              })}
            </Paragraph>
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
              !appointment.message && styles.cardLastItemNoBorder
            ]}
          />
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

function select({ profile, appointmentconfirmation }: any) {
  const name = (profile && ` ${toString.person(profile)}`) || ''
  return { appointment: appointmentconfirmation, name }
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('appointmentConfirmation.subtitle')
)(AppointmentConfirmation)
