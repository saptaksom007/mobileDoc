import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { FloatingAction } from 'react-native-floating-action'

import withKeyboardAvoidingView from 'screens/enhancers/withKeyboardAvoidingView'
import BookAppointmentActions from 'screens/BookAppointment/BookAppointment.actions'

import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'

import { Icon } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'
import { Badge } from 'components/Badge/Badge.component'

import { Color } from 'constants/Color'
import CalendarAgenda from './components/CalendarAgenda/CalendarAgenda.component'

import Actions from './CalendarEvent.actions'
import { PatientDtoType } from 'common-docdok/lib/domain/healthrelation/types/patientDto'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import { Loader } from 'components/Loader/Loader.component'
import styles from './CalendarEvents.styles'
import {
  ActionSheetProps,
  connectActionSheet,
} from '@expo/react-native-action-sheet'
import calendarConstants from './constants/calendarConstants'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import { Actions as NavAction } from 'navigation/SagaNavigation'

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<any>
  isLoggedIn: boolean
  navigationData: any
  addLoading: boolean
  profile: any
  physician: any
  patient: any
  events: any
  loading: boolean
}

interface State {
  currentItem: any
  view: number
  showCalendar: boolean
  currentDate: Date
}

export class CalendarEvent extends Component<Props, State> {
  focusListner: any = null
  constructor(props: Props) {
    super(props)
    this.onTapItem = this.onTapItem.bind(this)
    this.renderCalendar = this.renderCalendar.bind(this)
    this.onUpdateStatus = this.onUpdateStatus.bind(this)
    this.openActionSheet = this.openActionSheet.bind(this)
  }

  state = {
    visible: false,
    addView: false,
    moreOptions: false,
    currentType: '',
    currentItem: null,
    view: 0,
    showCalendar: false,
    currentDate: new Date(),
  }

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener('didFocus', () => {
      const { dispatch, patient } = this.props
      dispatch(
        Actions.getCalendarEventRequested({
          patient_uuid: patient?.uuid,
          couch_uuid: null,
          distinct: false,
        }),
      )
    })
  }

  componentWillUnmount() {
    if (this.focusListner) {
      this.focusListner.remove()
    }
  }
  otherDoctorInput: any

  scrollView: any

  onTapItem(data: any) {
    const { dispatch } = this.props
    dispatch(Actions.navigateToCalendarEventAdd(data?.eventType, data))
  }

  onUpdateStatus(reqPayload: any) {
    const { dispatch } = this.props
    dispatch(Actions.addCalendarEventRequested(reqPayload))
  }
  openActionSheet() {
    const { showActionSheetWithOptions } = this.props
    const options = [i18n.t('events.add.daily'), i18n.t('events.add.weekly')]
    const cancelButtonIndex = 2
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        this.setState({
          view: buttonIndex,
        })
      },
    )
  }

  renderCalendar() {
    return (
      <Calendar
        current={this.state.currentDate}
        maxDate={new Date()}
        onDayPress={day => {
          this.setState({
            currentDate: moment(day.timestamp).toDate(),
            showCalendar: false,
          })
        }}
        theme={{
          selectedDayTextColor: Color.blueD,
          arrowColor: Color.blueD,
        }}
        style={{
          elevation: 6,
        }}
        hideExtraDays
      />
    )
  }

  render() {
    const { dispatch, isLoggedIn, navigationData, events, loading } = this.props

    const items = events
    const futureAppointmentsCount = navigationData?.futureAppointmentsCount ?? 0
    if (!isLoggedIn) {
      return null
    }

    if (loading && items.length) {
      return <Loader />
    }
    return (
      <View style={styles.flex}>
        <View style={[styles.padder, styles.rowCenter, styles.spaceBetween]}>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showCalendar: !this.state.showCalendar,
                })
              }}
            >
              <Text>
                {moment(this.state.currentDate).format('MMMM')}{' '}
                {moment(this.state.currentDate).format('YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.rowCenter, styles.spaceBetween]}>
            <TouchableOpacity
              onPress={() => {
                this.openActionSheet()
              }}
            >
              <Icon
                name='event'
                color={Color.blueD}
                containerStyle={{ marginRight: 12 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(NavAction.push('appointmentslist'))
              }}
            >
              <View style={styles.badgeView}>
                <Badge value={futureAppointmentsCount} size={12} />
              </View>
              <Icon name='notifications' color={Color.blueD} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.showCalendar && false ? (
          this.renderCalendar()
        ) : (
          <CalendarAgenda
            currentDate={this.state.currentDate}
            setCurrentDate={date => {
              this.setState({
                currentDate: date,
              })
            }}
            items={items}
            onTapItem={this.onTapItem}
            onUpdateStatus={this.onUpdateStatus}
            isWeeklyView={this.state.view === 1}
          />
        )}
        <FloatingAction
          color={Color.blueD}
          actions={calendarConstants.fabActions}
          onPressItem={name => {
            if (name === 'appointments') {
              dispatch(
                BookAppointmentActions.navigateToBookAppointment(
                  navigationData?.forceConversationId ||
                    navigationData?.conversationId,
                  navigationData?.patients?.[0]?.clinicId,
                  navigationData?.scheduleAppointment,
                ),
              )
            } else {
              dispatch(Actions.navigateToCalendarEventLoadList(String(name)))
            }
          }}
        />
      </View>
    )
  }
}

function select(state: any) {
  const {
    login: { isLoggedIn },
    calendarEvents: { navigationData, addLoading, loading, events },
    profile,
    healthrelationCache: { patients, professionals },
  }: any = state

  const patient: any = Object.values(patients as PatientDtoType[]).find(
    findPatientSelf,
  )
  const physician: any = patient && professionals[patient.primaryPhysicianUuid]

  return {
    navigationData,
    isLoggedIn,
    profile,
    physician,
    patient,
    addLoading,
    loading,
    events,
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
  withKeyboardAvoidingView,
)(CalendarEvent)
