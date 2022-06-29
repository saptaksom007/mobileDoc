import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  connectActionSheet,
  ActionSheetProps,
} from '@expo/react-native-action-sheet'
import { prop } from 'ramda'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import i18n from 'ex-react-native-i18n'
import HomeLink from 'components/HomeLink/HomeLink.component'
import BookAppointmentActions from 'screens/BookAppointment/BookAppointment.actions'
import CalendarEventActions from 'screens/CalendarEvent/CalendarEvent.actions'
import DashboardActions from 'screens/Dashboard/Dashboard.actions'

import primaryConSelector from 'common-docdok/lib/domain/messaging/selectors/primaryConSelector'
import {
  findPatientSelf,
  findPatientProxy,
} from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import {
  hasOnlyOneConversation,
  isChat,
} from 'common-docdok/lib/domain/messaging/selectors/findConversation'
import { getTestId } from 'utilities/environment'
import { ConversationDtoType } from 'common-docdok/lib/types'
import { UserOrigins } from 'constants/UserOrigins'

const testId = getTestId('book-appointment')

interface Props
  extends MakePropsOptional<ActionSheetProps, 'showActionSheetWithOptions'> {
  isLoggedIn?: boolean
  conversationId: number
  forceConversationId?: number
  scheduleAppointment?: number
  onlyOneConversation?: boolean
  dispatch(x: any): void
  conversations: Array<{ id: number }>
  patients: Array<{ firstName: string; clinicId: number }>
  origin?: string
}

export class BookAppointmentLink extends PureComponent<Props> {
  static defaultProps = {
    forceConversationId: undefined,
  }
  openActionSheet = () => {
    const {
      showActionSheetWithOptions,
      dispatch,
      conversations,
      patients,
    } = this.props
    if (showActionSheetWithOptions) {
      const options = [
        ...patients.map(prop('firstName')),
        i18n.t('global.cancel'),
      ]
      const cancelButtonIndex = options.length - 1
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) =>
          buttonIndex !== cancelButtonIndex &&
          dispatch(
            BookAppointmentActions.navigateToBookAppointment(
              conversations[buttonIndex].id,
              patients[buttonIndex].clinicId,
            ),
          ),
      )
    }
  }

  render() {
    const {
      isLoggedIn,
      dispatch,
      conversationId,
      onlyOneConversation,
      forceConversationId,
      patients,
      scheduleAppointment,
      origin,
    } = this.props
    if (!isLoggedIn && !scheduleAppointment) {
      return null
    }
    const isMigros = false && origin === UserOrigins.MIGROS

    return (
      <HomeLink
        title={i18n.t(
          isMigros
            ? 'dashboard.bookAppointmentMIGROS'
            : 'dashboard.bookAppointment',
        )}
        onPress={() => {
          if (!isLoggedIn) {
            dispatch(
              DashboardActions.loginWithNextRouteRequested(
                NavAction.push('dashboard'),
              ),
            )
          } else {
            if (onlyOneConversation || forceConversationId) {
              dispatch(
                CalendarEventActions.navigateToCalendarEventList(
                  Boolean(onlyOneConversation || forceConversationId),
                  forceConversationId || conversationId,
                  patients[0].clinicId,
                  scheduleAppointment,
                ),
              )
            } else {
              this.openActionSheet()
            }
          }
        }}
        iconName='calendar-plus'
        iconType='material-community'
        testID={testId}
      />
    )
  }
}

function select(state: any) {
  const {
    login: { isLoggedIn },
    healthrelation: { patients: patientLight },
    messaging: { conversations },
    healthrelationCache: { patients: patientsCache, professionals },
  }: any = state

  const patientSelf = patientLight.find(findPatientSelf)
  const patient = patientSelf || patientLight.find(findPatientProxy)
  const conversationId = patient && primaryConSelector(state, patient.uuid)
  const convs = Object.values(conversations) as ConversationDtoType[]
  const conversationsList = convs.filter(isChat)
  const onlyOneConversation = hasOnlyOneConversation(conversationsList)
  const patients =
    patientsCache &&
    conversationsList
      .map((conv: any) => {
        if (
          conv.meta.healthcareSubject &&
          patientsCache[conv.meta.healthcareSubject]
        ) {
          const { firstName, primaryPhysicianUuid } = patientsCache[
            conv.meta.healthcareSubject
          ]
          return { firstName, primaryPhysicianUuid }
        }
        return undefined
      })
      .map((pat: any) => ({
        firstName: pat && pat.firstName,
        clinicId:
          pat &&
          professionals &&
          professionals[pat.primaryPhysicianUuid] &&
          professionals[pat.primaryPhysicianUuid].clinicId,
      }))
  return {
    conversationId,
    isLoggedIn,
    onlyOneConversation,
    conversations: conversationsList,
    patients,
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
)(BookAppointmentLink)
