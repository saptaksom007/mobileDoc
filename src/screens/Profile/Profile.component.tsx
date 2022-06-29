import * as React from 'react'

import * as MailComposer from 'expo-mail-composer'
import Constants from 'expo-constants'

import {
  Clipboard,
  TouchableOpacity,
  ScrollView,
  Platform,
  InteractionManager,
  Linking,
} from 'react-native'
import {
  connectActionSheet,
  ActionSheetProps,
} from '@expo/react-native-action-sheet'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import get from 'lodash/get'
import { Small } from 'components/CustomText/CustomText.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import { connect } from 'react-redux'
import i18n from 'ex-react-native-i18n'
import { compose } from 'recompose'
import { getStorageItemDecrypted } from 'utilities/localStorage'

import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'

import toString from 'common-docdok/lib/utils/toString'
import PersistStore from 'common-docdok/lib/configuration/persistStore'
import { healthrelationActions } from 'common-docdok/lib/domain/healthrelation/actions'

import { getVersion, getDisplayVersion } from 'utilities/version'
import { Color } from 'constants/Color'
import { Avatar } from 'components/Avatar/Avatar.component'
import withSubtitle from 'screens/enhancers/withSubtitle'
import withoutKeyboard from 'screens/enhancers/withoutKeyboard'

import { getTestId } from 'utilities/environment'

import DashboardActions from 'screens/Dashboard/Dashboard.actions'

import Actions from './Profile.actions'
import styles from './Profile.styles'
import { Action } from 'redux'
import { LIMITED_ACCESS_TOKEN_KEY } from 'config/auth'
import { PatientDtoType } from 'common-docdok/lib/domain/healthrelation/types/patientDto'

const testIdLogout = getTestId('logout-button')
const testIdTerms = getTestId('term-button')
const testIdHelp = getTestId('help-button')

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  profile: any
  avatarPicture: string
  physician: any
  patient: { primaryPhysicianUuid: string }
  clinic: any
}

export class Profile extends React.Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { patient, dispatch, physician } = this.props
      if (patient && !physician) {
        dispatch(
          healthrelationActions.loadMissingProfessionals([
            patient.primaryPhysicianUuid,
          ]),
        )
      } else if (physician && physician.clinicId) {
        dispatch(
          healthrelationActions.getClinicRequested(String(physician.clinicId)),
        )
      }
    })
  }

  help = async () => {
    const {
      profile: { email, mobileNumber },
      physician,
      clinic,
    } = this.props
    const {
      deviceYearClass,
      expoVersion,
      manifest,
      platform,
      deviceName,
      getWebViewUserAgentAsync,
    } = Constants
    const subject = 'docdok Kundendienstanfrage'
    const body = `

    =======
    ${i18n.t('profile.help.keepInfos')}

    - Clinic name: ${(clinic && clinic.name) || '-'}
    - Doctor name: ${toString.person(physician, '-')}
    - User email: ${email || '-'}
    - User mobile: ${mobileNumber || '-'}
    - App version: ${manifest.version}
    - Published time: ${manifest.publishedTime}
    - Release channel: ${manifest.releaseChannel}
    - OS: ${Platform.OS}
    - OS Version: ${Platform.Version}
    - Device year class: ${deviceYearClass}
    - Expo version: ${expoVersion}
    - Device name: ${deviceName}
    ${
      Platform.OS === 'ios'
        ? `- Smartphone: ${platform ? platform.ios!.model : 'unknown'}`
        : `- User Agent: ${await getWebViewUserAgentAsync()}`
    }`

    MailComposer.composeAsync({
      subject,
      body,
      recipients: ['supportdesk@docdok.atlassian.net'],
    }).catch(() => {
      const url =
        'mailto:supportdesk@docdok.atlassian.net?subject=' +
        `${subject}&body=${body}`
      Linking.openURL(url)
    })
  }

  logout() {
    const { dispatch } = this.props
    dispatch(DashboardActions.logOutRequested())
  }

  openActionSheet() {
    const { showActionSheetWithOptions, dispatch } = this.props
    const options = [
      i18n.t('profile.actionSheet.camera'),
      i18n.t('profile.actionSheet.library'),
      i18n.t('global.cancel'),
    ]
    const cancelButtonIndex = 2
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex =>
        buttonIndex !== cancelButtonIndex &&
        dispatch(Actions.updateAvatarRequested(buttonIndex)),
    )
  }

  render() {
    const { profile, avatarPicture, dispatch } = this.props
    const langKey = get(profile, 'langKey', i18n.t('profile.default.lang'))
    const lang = i18n.t(`profile.language.${langKey}`, {
      defaultValue: i18n.t('profile.default.lang'),
    })
    const firstname = get(profile, 'firstName', 'A')

    return (
      <ScrollView>
        <Card
          containerStyle={styles.container}
          title={i18n.t('profile.card.welcome', {
            salutation:
              profile && profile.salutation ? `${profile.salutation} ` : '',
            firstname,
            lastname: get(profile, 'lastName', ''),
          })}
          titleStyle={styles.welcome}
          fontFamily={fontFamily}
        >
          <ListItem
            {...{
              avatar: <Avatar name={firstname} url={avatarPicture} />,
              fontFamily,
            }}
            title={i18n.t('profile.card.listItem.name')}
            subtitle={
              `${get(
                profile,
                'firstName',
                i18n.t('profile.default.firstName'),
              )} ` +
              `${get(profile, 'lastName', i18n.t('profile.default.lastName'))}`
            }
            roundAvatar
            hideChevron
          />
          <ListItem
            title={i18n.t('profile.card.listItem.mobileNumber')}
            subtitle={get(
              profile,
              'mobileNumber',
              i18n.t('profile.default.mobileNumber'),
            )}
            hideChevron
            fontFamily={fontFamily}
          />
          <ListItem
            title={i18n.t('profile.card.listItem.email')}
            subtitle={get(profile, 'email', i18n.t('profile.default.email'))}
            hideChevron
            fontFamily={fontFamily}
          />
          <ListItem
            title={i18n.t('profile.card.listItem.language')}
            subtitle={lang}
            hideChevron
            fontFamily={fontFamily}
          />
          <Button
            onPress={() => this.openActionSheet()}
            icon={{ name: 'add-a-photo' }}
            buttonStyle={styles.button}
            backgroundColor={'#1a7dae'}
            title={i18n.t('profile.card.button.updateAvatar')}
            fontFamily={fontFamily}
          />

          <Button
            onPress={() => dispatch(DashboardActions.showTerms())}
            icon={{ name: 'gavel' }}
            buttonStyle={styles.button}
            backgroundColor={'#1f95d0'}
            title={i18n.t('terms.title')}
            fontFamily={fontFamily}
            testID={testIdTerms}
            accessibilityLabel={testIdTerms}
          />

          <Button
            onPress={async () => this.logout()}
            icon={{ name: 'md-log-out', type: 'ionicon' }}
            buttonStyle={styles.button}
            backgroundColor={'#ee366d'}
            title={i18n.t('profile.card.button.logout')}
            fontFamily={fontFamily}
            testID={testIdLogout}
            accessibilityLabel={testIdLogout}
          />
          {__DEV__ && (
            <Button
              onPress={async () => {
                console.log(await PersistStore.getAllStore())
                console.log(
                  'PersistStore.getUserRefKey() => ',
                  PersistStore.getUserRefKey(),
                )
                console.log(
                  'PersistStore.getCurrentLocalStorageKey() =>',
                  PersistStore.getCurrentLocalStorageKey(),
                )
              }}
              buttonStyle={styles.button}
              backgroundColor={Color.tintColor}
              title={'Log Persist Store'}
              fontFamily={fontFamily}
            />
          )}
          {__DEV__ && (
            <Button
              onPress={async () => {
                console.log(
                  await getStorageItemDecrypted(LIMITED_ACCESS_TOKEN_KEY),
                )
              }}
              buttonStyle={styles.button}
              backgroundColor={Color.tintColor}
              title={'Log Limited Token'}
              fontFamily={fontFamily}
            />
          )}
        </Card>
        <Small
          style={styles.version}
          onPress={() => Clipboard.setString(getVersion())}
        >
          {getDisplayVersion()}
        </Small>
        <TouchableOpacity
          onPress={this.help}
          style={styles.helpLink}
          testID={testIdHelp}
          accessibilityLabel={testIdHelp}
        >
          <Icon name='help' color={Color.tintColor} size={18} />
          <Small style={styles.helpLinkText}>{i18n.t('global.help')}</Small>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

function select({
  profile,
  healthrelationCache: { patients, professionals, clinics },
}: any) {
  const patient: any = Object.values(patients as PatientDtoType[]).find(
    findPatientSelf,
  )
  const physician: any = patient && professionals[patient.primaryPhysicianUuid]
  const clinic: any = physician && clinics[physician.clinicId]
  return {
    profile,
    avatarPicture: profile && profile.avatarPicture,
    patient,
    physician,
    clinic,
  }
}

export default compose<Props, any>(
  withoutKeyboard,
  connectActionSheet,
  connect(select),
  withSubtitle('profile.subtitle'),
)(Profile)
