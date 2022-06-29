import React, { Component } from 'react'
import { InteractionManager, ScrollView, View } from 'react-native'
import {
  connectActionSheet,
  ActionSheetProps
} from '@expo/react-native-action-sheet'
import { Card, ListItem, Button } from 'react-native-elements'
import { compose } from 'recompose'
import i18n from 'ex-react-native-i18n'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import { momentWithLocales, getCalendarOutputFormat } from 'utilities/date'

import { connect } from 'react-redux'
import withSubtitle from 'screens/enhancers/withSubtitle'
import MessageMyDoctor from 'components/MessageMyDoctor/MessageMyDoctor.component'
import { Avatar } from 'components/Avatar/Avatar.component'
import BookAppointmentLink from 'components/BookAppointmentLink/BookAppointmentLink.component'
import { Color } from 'constants/Color'

import { findConversationForHealthSubjectUuid } from 'common-docdok/lib/domain/messaging/selectors/findConversation'
import { healthrelationActions } from 'common-docdok/lib/domain/healthrelation/actions'

import Actions from './DossierDetail.actions'

import styles from './DossierDetail.styles'
import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<{ params: { patientId: string } }>
  patients: { [key: string]: any }
  professionals: {
    [key: string]: { salutation: string; firstName: string; lastName: string }
  }
  conversationsArray: any[]
}

export class DossierDetail extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const {
        dispatch,
        navigation: {
          state: { params }
        }
      } = this.props
      const currentPatient = this.getCurrentPatient()
      if (currentPatient) {
        dispatch(
          healthrelationActions.loadMissingProfessionals([
            currentPatient.primaryPhysicianUuid
          ])
        )
      }
      dispatch(healthrelationActions.loadPatientRequested(params.patientId))
    })
  }

  getCurrentPatient = (): any => {
    const {
      patients,
      navigation: {
        state: { params }
      }
    } = this.props
    return patients[params.patientId]
  }

  getPhysicianName = () => {
    const patient: any = this.getCurrentPatient()
    const { professionals } = this.props
    const { primaryPhysicianUuid } = patient
    const physician = professionals[primaryPhysicianUuid]
    return physician
      ? `${physician.salutation} ${physician.firstName} ${physician.lastName}`
      : 'Loading...'
  }

  openActionSheet = () => {
    const {
      showActionSheetWithOptions,
      dispatch,
      navigation: {
        state: { params }
      }
    } = this.props

    const options = [
      i18n.t('dossierDetail.actionSheet.camera'),
      i18n.t('dossierDetail.actionSheet.library'),
      i18n.t('global.cancel')
    ]
    const cancelButtonIndex = 2
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex =>
        buttonIndex !== 2 &&
        dispatch(
          Actions.updateRelativePhotoRequested(buttonIndex, params.patientId)
        )
    )
  }

  render() {
    const { conversationsArray } = this.props
    const patient: any = this.getCurrentPatient()
    const conversation: any = conversationsArray.find(
      findConversationForHealthSubjectUuid(patient.uuid)
    )
    const name = patient && `${patient.firstName} ${patient.lastName}`
    const avatar = <Avatar name={name} url={patient && patient.avatarPicture} />
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card fontFamily={fontFamily}>
          <ListItem
            avatar={avatar}
            roundAvatar
            title={i18n.t('dossierDetail.name')}
            subtitle={name}
            hideChevron
            fontFamily={fontFamily}
          />
          <ListItem
            title={i18n.t('dossierDetail.birthday')}
            subtitle={
              patient &&
              momentWithLocales(patient.birthdate).calendar(
                undefined,
                getCalendarOutputFormat()
              )
            }
            hideChevron
            fontFamily={fontFamily}
          />
          <ListItem
            title={i18n.t('dossierDetail.gender')}
            subtitle={patient && patient.gender}
            hideChevron
            fontFamily={fontFamily}
          />
          <ListItem
            title={i18n.t('dossierDetail.primaryPhysician')}
            subtitle={this.getPhysicianName()}
            hideChevron
            fontFamily={fontFamily}
          />
          <Button
            onPress={this.openActionSheet}
            icon={{ name: 'add-a-photo' }}
            buttonStyle={styles.button}
            backgroundColor={Color.tintColor}
            title={i18n.t('profile.card.button.updateAvatar')}
            fontFamily={fontFamily}
          />
        </Card>
        {conversation && (
          <View style={styles.bottomLinks}>
            <MessageMyDoctor
              forceConversationId={conversation.id}
              containerStyle={styles.messageMyDoctor}
            />
            <BookAppointmentLink forceConversationId={conversation.id} />
          </View>
        )}
      </ScrollView>
    )
  }
}

function select({
  healthrelationCache: { patients, professionals },
  messaging: { conversations }
}: any) {
  const conversationsArray = Object.values(conversations)
  return {
    patients,
    professionals,
    conversationsArray
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
  withSubtitle('dossier.subtitle')
)(DossierDetail)
