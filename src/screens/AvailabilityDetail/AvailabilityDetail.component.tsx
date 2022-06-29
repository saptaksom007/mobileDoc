import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ScrollView } from 'react-native'
import { compose } from 'recompose'
import i18n from 'ex-react-native-i18n'
import { Card, ListItem } from 'react-native-elements'
import withSubtitle from 'screens/enhancers/withSubtitle'
import { Bold, Medium } from 'components/CustomText/CustomText.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import MessageMyDoctor from 'components/MessageMyDoctor/MessageMyDoctor.component'
import { isInteger } from 'utilities/number'
import PhoneNumber from 'components/PhoneNumber/PhoneNumber.component'

import styles from './AvailabilityDetail.styles'

interface Props {
  navigation?: {
    state: {
      params: {
        clinicName: string
        clinicStreet: string
        clinicLocation: string
        clinicContact: string
        clinicMessage: string
        doctorMessage: string
        physicianRef: string
      }
    }
  }
}

export class AvailabilityDetail extends PureComponent<Props> {
  renderClinic() {
    const {
      clinicName,
      clinicStreet,
      clinicLocation,
      clinicContact
    } = this.props.navigation!.state.params
    const hasStreet = clinicStreet && clinicStreet !== ''
    const hasCity = clinicLocation && clinicLocation !== ''
    return (
      <Medium>
        <Bold>{i18n.t('availabilitydetail.card.clinic')}:</Bold> {clinicName}
        {'\n'}
        {(hasCity || hasStreet) && (
          <Bold>{i18n.t('availabilitydetail.card.address')}: </Bold>
        )}
        {hasStreet && (
          <Medium>
            {clinicStreet}
            {', '}
          </Medium>
        )}
        {hasCity && <Medium>{clinicLocation}</Medium>}
        {clinicContact && (
          <Medium>
            {'\n'}
            <Bold>{i18n.t('availabilitydetail.card.phone')}:</Bold>{' '}
            <PhoneNumber value={clinicContact} />
          </Medium>
        )}
      </Medium>
    )
  }

  renderClinicAvailability() {
    const { clinicMessage } = this.props.navigation!.state.params
    return (
      <Medium style={styles.centered}>
        <Bold>{i18n.t('availabilitydetail.card.clinicAvailability')}</Bold>
        {'\n'}
        <Medium>
          {isInteger(clinicMessage)
            ? i18n.t('availabilitydetail.card.clinicMessage', {
              hours: clinicMessage
            })
            : clinicMessage}
        </Medium>
      </Medium>
    )
  }

  renderDoctorAvailability() {
    const { doctorMessage } = this.props.navigation!.state.params
    return (
      <Medium style={styles.centered}>
        <Bold>{i18n.t('availabilitydetail.card.doctorAvailability')}</Bold>
        {'\n'}
        <Medium>{doctorMessage}</Medium>
      </Medium>
    )
  }

  render() {
    const {
      clinicName,
      clinicMessage,
      doctorMessage,
      physicianRef
    } = this.props.navigation!.state.params

    const clinic =
      !clinicMessage || clinicMessage === '' ? null : (
        <ListItem title={this.renderClinicAvailability()} hideChevron />
      )

    const doctor =
      !doctorMessage || doctorMessage === '' ? null : (
        <ListItem
          title={this.renderDoctorAvailability()}
          hideChevron
          containerStyle={styles.cardLastItemNoBorder}
        />
      )
    return (
      <ScrollView>
        <Card
          title={`${i18n.t('availabilitydetail.card.title')} - ${clinicName}`}
          containerStyle={styles.cardContainerStyle}
          titleStyle={styles.cardTitle}
          fontFamily={fontFamily}
        >
          <ListItem title={this.renderClinic()} hideChevron />
          {clinic}
          {doctor}
        </Card>
        <MessageMyDoctor
          otherFilter={(conversation: any) =>
            conversation.subscriptions.find(
              (sub: any) => sub.userRef === physicianRef
            )
          }
        />
      </ScrollView>
    )
  }
}

function select(): any {
  return {}
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('availabilitydetail.subtitle')
)(AvailabilityDetail)
