import React, { Component } from 'react'

import { View, ScrollView, InteractionManager, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { compose as Rcompose, pipe, length, head, propOr } from 'ramda'

import { compose } from 'recompose'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'

import withoutKeyboard from 'screens/enhancers/withoutKeyboard'

import { getTestId } from 'utilities/environment'

import uncheckedMessages from 'common-docdok/lib/domain/messaging/selectors/uncheckedMessages'
import primaryConSelector from 'common-docdok/lib/domain/messaging/selectors/primaryConSelector'
import { getClinicsFromAvailabilities } from 'common-docdok/lib/domain/healthrelation/selectors/findClinic'
import {
  hasOnlyOneConversation,
  isChat,
} from 'common-docdok/lib/domain/messaging/selectors/findConversation'
import { getNumberOfIncompleteSurvey } from 'common-docdok/lib/domain/survey/selectors/incompleteSurveys'

import AppointmentsListActions from 'screens/AppointmentsList/AppointmentsList.actions'
import Actions from './Dashboard.actions'
import styles from './Dashboard.styles'
import Box from './components/Box'
import { Action } from 'redux'
import { filterOldAppointment, filterMarkAsRead } from 'api/appointments'
import { ConversationDtoType } from 'common-docdok/lib/types'
import { UserOrigins } from 'constants/UserOrigins'
import { Color } from 'constants/Color'
import { Layout } from 'constants/Layout'
import CalendarEventActions from 'screens/CalendarEvent/CalendarEvent.actions'
import { FloatingAction } from 'react-native-floating-action'
import BookAppointmentActions from 'screens/BookAppointment/BookAppointment.actions'
import calendarConstants from 'screens/CalendarEvent/constants/calendarConstants'

const testIdDashboard = getTestId('dashboard')
const testIdConversations = getTestId('dashboard-nav-conversation')
const testIdSurvey = getTestId('dashboard-nav-survey')
const testIdAppointment = getTestId('dashboard-nav-appointment')
const testIdDossier = getTestId('dashboard-nav-dossier')
const testIdAvailability = getTestId('dashboard-nav-availability')

interface Props {
  dispatch(action: Action): void
  incompleteSurveys: number
  unreadMessages: number
  futureAppointmentsCount: number
  primaryConversation: any
  isLoggedIn?: boolean
  onlyOneConversation: boolean
  numberOfPatients: number
  patient: any
  clinics: any[]
  isLoading?: boolean
  rememberedGoToChatAction?: Action
  origin: 'SPITALSTSAG' | undefined
  forceConversationId: number
  primaryConversationId: number
  scheduleAppointment: number
  patients: Array<{ firstName: string; clinicId: number }>
}

export class Dashboard extends Component<Props> {
  componentDidMount() {
    const { dispatch, isLoggedIn, rememberedGoToChatAction } = this.props
    StatusBar.setHidden(false)
    StatusBar.setBarStyle('dark-content')
    if (isLoggedIn) {
      if (rememberedGoToChatAction) {
        dispatch(ConversationsListActions.execRememberedGotoChatRequested())
      }
      InteractionManager.runAfterInteractions(() => {
        // warning this succeeded action
        // with next route feature on login
        dispatch(Actions.enableNotificationsRequested())
        dispatch(AppointmentsListActions.appointmentsListRequested())
        // dispatch(Actions.loggedInUserDetails())
      })
    }
  }

  chatAction = () => {
    const { primaryConversation, onlyOneConversation } = this.props
    if (onlyOneConversation && primaryConversation) {
      return ConversationsListActions.gotoChatRequested(primaryConversation.id)
    }
    return NavAction.push('conversationslist')
  }

  render() {
    const {
      incompleteSurveys,
      unreadMessages,
      futureAppointmentsCount,
      isLoggedIn,
      numberOfPatients,
      patient,
      clinics,
      origin,
      dispatch,
      onlyOneConversation,
      forceConversationId,
      primaryConversationId,
      patients,
      scheduleAppointment,
    } = this.props
    const noHospital = origin === 'SPITALSTSAG'

    const isMigros = false && origin === UserOrigins.MIGROS

    return (
      // <ImageBackground
      //   source={require('assets/images/Background.png')}
      //   style={styles.bg}
      // >
      <>
        <ScrollView
          contentContainerStyle={styles.container}
          testID={testIdDashboard}
          accessibilityLabel={testIdDashboard}
        >
          {/* <View
            style={{
              backgroundColor: '#1a7dae',
              height: Layout.window.height * 0.12,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                }}
              >
                <Icon
                  name={'notifications-none'}
                  size={34}
                  color={Color.white}
                />
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  paddingRight: 40,
                  paddingHorizontal: 15,
                  paddingVertical: 7,
                }}
              >
                <Bold style={{ color: Color.white }}>
                  Hi {patientFirstName}
                </Bold>

                <Paragraph style={{ color: Color.white }}>
                  Tap here to see 3 items on your agenda today
                </Paragraph>
              </View>
            </View>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: Layout.window.width * 0.05,
            }}
          >
            <Box
              name={'event'}
              badgeNumber={futureAppointmentsCount}
              nextRoute={() =>
                CalendarEventActions.navigateToCalendarEventList(
                  Boolean(onlyOneConversation || forceConversationId),
                  forceConversationId || primaryConversationId,
                  patients[0].clinicId,
                  scheduleAppointment,
                  futureAppointmentsCount,
                )
              }
              testID={testIdAppointment}
              origin={origin}
              color={'#8950b7'}
            />

            <Box
              name={'question-answer'}
              badgeNumber={unreadMessages}
              testID={testIdConversations}
              locked={!isLoggedIn}
              nextRoute={this.chatAction}
              origin={origin}
              color={'#1a7dae'}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: Layout.window.width * 0.05,
            }}
          >
            <Box
              name={'stacked-line-chart'}
              locked={!isLoggedIn}
              nextRoute={() => NavAction.push('comingsoon')}
              testID={testIdSurvey}
              origin={origin}
              color={'#fba81f'}
            />
            {/* <Box
              name={'show-chart'}
              badgeNumber={incompleteSurveys}
              locked={!isLoggedIn}
              nextRoute={() =>
                numberOfPatients === 1
                  ? NavAction.push('survey', { patientId: patient.uuid })
                  : NavAction.push('surveybydossier')
              }
              testID={testIdSurvey}
              origin={origin}
              color={'#1a7dae'}
            /> */}
            <Box
              badgeNumber={incompleteSurveys}
              name={'description'}
              locked={!isLoggedIn}
              nextRoute={() =>
                numberOfPatients === 1
                  ? NavAction.push('survey', { patientId: patient.uuid })
                  : NavAction.push('surveybydossier')
              }
              testID={testIdDossier}
              origin={origin}
              color={'#27debe'}
            />
            {/* <Box
            name={'bar-chart'}
            nextRoute={() => NavAction.push('myprogress')}
            testID={testIdAppointment}
            origin={origin}
            color={'#1a7dae'}
          /> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: Layout.window.width * 0.05,
            }}
          >
            {!noHospital && !isMigros ? (
              <>
                <Box
                  name={'escalator-warning'}
                  locked={!isLoggedIn}
                  nextRoute={() => NavAction.push('dossier')}
                  testID={testIdDossier}
                  origin={origin}
                  color={'#2a6df7'}
                />
                <Box
                  name={'officehours'}
                  locked={!isLoggedIn}
                  nextRoute={() =>
                    clinics.length === 1
                      ? NavAction.push('availabilitydetail', { ...clinics[0] })
                      : NavAction.push('availabilitylist')
                  }
                  testID={testIdAvailability}
                  color={'#f37a9e'}
                />
              </>
            ) : null}
          </View>

          {/* {!isSmallScreen() && (
            <View
              style={[
                styles.bottomLinks,
                noHospital && { bottom: 70, justifyContent: 'center' },
              ]}
            >
              <MessageMyDoctor
                containerStyle={styles.messageMyDoctor}
                origin={origin}
              />
              {!noHospital ? <BookAppointmentLink origin={origin} /> : null}
            </View>
          )} */}
        </ScrollView>
        <FloatingAction
          color={Color.blueD}
          actions={calendarConstants.fabActions}
          onPressItem={name => {
            if (name === 'appointments') {
              dispatch(
                BookAppointmentActions.navigateToBookAppointment(
                  forceConversationId || primaryConversationId,
                  patients?.[0]?.clinicId,
                  scheduleAppointment,
                ),
              )
            } else {
              dispatch(
                CalendarEventActions.navigateToCalendarEventLoadList(
                  String(name),
                ),
              )
            }
          }}
        />
      </>
      // </ImageBackground>
    )
  }
}

const getNumberOfFutureAppointments = length

const getFutureAppointmentId = pipe<string, string, number>(
  head,
  propOr(0, 'id'),
)

function select(state: any): any {
  const {
    survey: { mySurveys },
    login: { isLoggedIn },
    appointmentslist,
    messaging,
    profile,
    healthrelation: { patients, availabilities },
    loadingStack: { isLoading },
    conversation: { rememberedGoToChatAction },
    scheduleappointment,
  } = state
  const conversations = Object.values(
    messaging.conversations,
  ) as ConversationDtoType[]
  const unreadMessages = conversations
    .filter(isChat)
    .map((c: any) => c.id)
    .reduce((current, id) => current + uncheckedMessages(messaging, id), 0)

  const currentUser = profile && profile.uid
  const origin = profile && profile.origin

  const patient = patients.filter((p: any) => p.userRef === currentUser)[0]
  const primaryConversationId = patient
    ? primaryConSelector(state, patient.uuid)
    : undefined
  const primaryConversation = primaryConversationId
    ? messaging.conversations[primaryConversationId]
    : undefined

  const incompleteSurveys = getNumberOfIncompleteSurvey(mySurveys || [])

  const futureAppointmentsCount = getNumberOfFutureAppointments(
    // @ts-ignore
    Rcompose(
      filterOldAppointment,
      // @ts-ignore
      filterMarkAsRead,
    )(appointmentslist.rawList || []),
  )

  const numberOfPatients = (patients && patients.length) || 0

  const appointmentId = getFutureAppointmentId(
    // @ts-ignore
    filterOldAppointment(appointmentslist.rawList || []),
  )

  const onlyOneConversation = hasOnlyOneConversation(
    Object.values(messaging.conversations),
  )

  const clinics = getClinicsFromAvailabilities(availabilities)

  return {
    unreadMessages: isLoggedIn ? unreadMessages : 0,
    incompleteSurveys: isLoggedIn ? incompleteSurveys : 0,
    primaryConversation,
    onlyOneConversation,
    futureAppointmentsCount,
    numberOfPatients,
    appointmentId,
    isLoggedIn,
    patient,
    clinics,
    isLoading,
    rememberedGoToChatAction,
    origin,
    patients,
    primaryConversationId,
    scheduleAppointment: scheduleappointment,
  }
}

export default compose<Props, any>(withoutKeyboard, connect(select))(Dashboard)
