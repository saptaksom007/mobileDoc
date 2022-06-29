import React, { Component } from 'react'
import { View, ScrollView, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import i18n from 'ex-react-native-i18n'
import { Card, ListItem } from 'react-native-elements'

import { findConversationForHealthSubjectUuid as findConversation } from 'common-docdok/lib/domain/messaging/selectors/findConversation'

import { momentWithLocales } from 'utilities/date'
import {
  Paragraph,
  Medium,
  Bold,
} from 'components/CustomText/CustomText.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import Clinic from 'components/Clinic/Clinic.component'
import BookAppointmentLink from 'components/BookAppointmentLink/BookAppointmentLink.component'
import { withLoader } from 'screens/enhancers/withLoader'
import withSubtitle from 'screens/enhancers/withSubtitle'
import { Loader } from 'components/Loader/Loader.component'
import AppointmentConfirmationActions from 'screens/AppointmentConfirmation/AppointmentConfirmation.actions'
import Actions from 'screens/Appointment/Appointment.actions'

import styles from './ScheduleAppointment.styles'
import { Action } from 'redux'
import { ConversationDtoType } from 'common-docdok/lib/types'

interface Props {
  name: string
  clinic: string
  date: string
  street: string
  location: string
  phoneNumber: string
  dispatch(action: Action): void
  refreshing: boolean
  conversationId: number
  navigation: { state: { params: { appointmentId: number } } }
}

export class ScheduleAppointment extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const {
        navigation: {
          state: {
            params: { appointmentId },
          },
        },
        dispatch,
      } = this.props
      dispatch(Actions.appointmentRequested(appointmentId))
      dispatch(
        AppointmentConfirmationActions.markAsReadAppointmentConfirmation(
          appointmentId,
        ),
      )
    })
  }

  renderMessage = () => {
    const { date } = this.props
    return (
      <Medium style={styles.cardMessage}>
        <Bold>{i18n.t('scheduleAppointment.card.message')}</Bold>
        {'\n'}
        {date}
      </Medium>
    )
  }

  renderClinic = () => {
    const { clinic, phoneNumber, street, location } = this.props
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
    const {
      clinic,
      name,
      refreshing,
      conversationId,
      navigation: {
        state: {
          params: { appointmentId },
        },
      },
    } = this.props

    if (refreshing || !name) {
      return <Loader />
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.messageContainer}>
          <Paragraph style={styles.scheduleMessage}>
            <Paragraph>
              {i18n.t('scheduleAppointment.salutation', {
                name,
                default: 'Hello,',
              })}
            </Paragraph>
            {'\n'}
            {'\n'}
            <Paragraph>
              {i18n.t('scheduleAppointment.message', {
                clinic,
              })}
            </Paragraph>
          </Paragraph>
        </View>
        <Card
          containerStyle={styles.cardContainerStyle}
          title={i18n.t('scheduleAppointment.card.title')}
          titleStyle={styles.cardTitle}
          fontFamily={fontFamily}
        >
          <ListItem
            title={this.renderMessage()}
            hideChevron
            containerStyle={styles.cardLastItem}
          />

          <ListItem
            title={this.renderClinic()}
            hideChevron
            containerStyle={[styles.cardLastItem, styles.cardLastItemNoBorder]}
          />
        </Card>
        <View style={styles.bottomLinks}>
          <BookAppointmentLink
            forceConversationId={conversationId}
            scheduleAppointment={appointmentId}
          />
        </View>
      </ScrollView>
    )
  }
}

function select({
  appointment: { data, refreshing },
  messaging: { conversations },
}: any) {
  const conv: ConversationDtoType | undefined =
    data &&
    Object.values(conversations as ConversationDtoType[]).find(
      findConversation(data.healthSubjectUuid),
    )
  return {
    name: (data && data.patientName) || '',
    clinic: (data && data.clinicName) || '',
    date:
      (data &&
        momentWithLocales(data.appointmentTime).format('dddd, MMMM Do')) ||
      '',
    street: (data && data.clinicStreet) || '',
    location: (data && data.clinicLocation) || '',
    phoneNumber: (data && data.clinicContact) || '',
    refreshing,
    conversationId: conv && conv.id,
  }
}

export default compose<Props, any>(
  connect(select),
  withLoader,
  withSubtitle('scheduleAppointment.subtitle'),
)(ScheduleAppointment)
