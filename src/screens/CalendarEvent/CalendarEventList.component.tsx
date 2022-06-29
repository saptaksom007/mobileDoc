import React, { Component } from 'react'
import {
  View,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withKeyboardAvoidingView from 'screens/enhancers/withKeyboardAvoidingView'

import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'

import { Color } from 'constants/Color'

import styles from './CalendarEvents.styles'
import ActivityListItem from './components/ActivityListItem/ActivityListItem.component'
import Actions from './CalendarEvent.actions'
import { PatientDtoType } from 'common-docdok/lib/domain/healthrelation/types/patientDto'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import { isArray } from 'lodash'
import { Icon } from 'react-native-elements'
import { AppTextInput } from 'components/AppTextInput/AppTextInput.component'
import i18n from 'ex-react-native-i18n'
import {
  ActionSheetProps,
  connectActionSheet,
} from '@expo/react-native-action-sheet'
import calendarConstants from './constants/calendarConstants'

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<any>
  isLoggedIn: boolean
  type: any
  addLoading: boolean
  deleteLoading: boolean
  profile: any
  physician: any
  patient: any
  events: any[]
  eventsArr: any[]
  loading: boolean
}

interface State {
  currentItem: any
  type: any
  keyword: string
}

const types = ['exercise', 'nutrition', 'activity']

export class CalendarEventList extends Component<Props, State> {
  state = {
    visible: false,
    addView: false,
    moreOptions: false,
    currentType: '',
    currentItem: null,
    type: null,
    keyword: '',
  }

  constructor(props: Props) {
    super(props)
    this.openActionSheet = this.openActionSheet.bind(this)
    const { type: typeDetails } = this.props
    this.setState({
      type: typeDetails?.type,
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { dispatch, patient } = this.props
      dispatch(
        Actions.getCalendarEventRequested({
          patient_uuid: patient?.uuid,
          couch_uuid: null,
          distinct: true,
        }),
      )
    })
  }

  otherDoctorInput: any

  scrollView: any

  openActionSheet() {
    const { showActionSheetWithOptions } = this.props
    const options = [
      i18n.t('exercise'),
      i18n.t('nutrition'),
      i18n.t('activity'),
    ]
    const cancelButtonIndex = 3
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        this.setState({
          type: types[buttonIndex],
        })
      },
    )
  }

  render() {
    const {
      dispatch,
      isLoggedIn,
      eventsArr,
      type: typeDetails,
      deleteLoading,
      loading,
    } = this.props

    const selectedType: 'activity' | 'nutrition' | 'exercise' =
      this.state.type || typeDetails?.type || 'activity'
    if (!isLoggedIn) {
      return null
    }

    let selectedEventsBasedOnType: any[] = isArray(eventsArr)
      ? eventsArr.filter(
          e =>
            String(e.type).toLowerCase() === String(selectedType).toLowerCase(),
        )
      : []

    if (this.state.keyword) {
      selectedEventsBasedOnType = selectedEventsBasedOnType.filter(s => {
        return String(s.name)
          .toLowerCase()
          .includes(String(this.state.keyword).toLowerCase())
      })
    }

    const eventColor: string =
      calendarConstants?.eventsIcons?.[selectedType]?.color ?? ''
    console.log({ typeDetails })
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.padder,
            styles.eventHeader,
            {
              backgroundColor: eventColor,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              this.openActionSheet()
            }}
            style={styles.rowCenter}
          >
            <Text style={{ color: Color.white }}>
              {String(i18n.t(selectedType)).toUpperCase()}
            </Text>
            <Icon
              type='font-awesome'
              name='chevron-circle-down'
              color={Color.white}
              containerStyle={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(Actions.navigateToCalendarEventAdd(selectedType))
            }}
            style={[styles.fab]}
          >
            <View>
              <Icon
                type='ionicon'
                name='add'
                color={eventColor}
                iconStyle={{ fontWeight: 'bold' }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.padder}>
          <AppTextInput
            containerStyle={{
              borderWidth: 1,
              borderColor: Color.borderColor,
              marginTop: 12,
              paddingHorizontal: 12,
            }}
            showLabel={false}
            placeholder={''}
            onChangeText={keyword => {
              this.setState({
                keyword,
              })
            }}
            value={this.state.keyword}
            icon={
              <Icon
                type='font-awesome'
                name='search'
                color={Color.blackTT}
                containerStyle={{ marginHorizontal: 12 }}
                size={16}
              />
            }
          />
        </View>
        <FlatList
          ListHeaderComponent={
            loading || deleteLoading ? (
              <ActivityIndicator color={Color.blueD} />
            ) : (
              <View />
            )
          }
          data={
            isArray(selectedEventsBasedOnType) ? selectedEventsBasedOnType : []
          }
          renderItem={({ item }) => {
            return (
              <ActivityListItem
                title={item.name}
                color={Color.black}
                style={{}}
                onPress={() => {
                  dispatch(
                    Actions.navigateToCalendarEventAdd(selectedType, {
                      ...item,
                      id: undefined,
                      duration: '',
                      startTimeDate: new Date(),
                      startTime: new Date(),
                    }),
                  )
                }}
              />
            )
          }}
          ListFooterComponent={<View style={{ height: 80 }} />}
          ListEmptyComponent={
            <View style={styles.emptyData}>
              <Text style={[styles.emptyText, styles.emptyTextTitle]}>
                {i18n.t('dontHaveActivity')}
              </Text>
              <Text style={styles.emptyText}>
                {i18n.t('clickPlusBtnToAdd')}
              </Text>
            </View>
          }
        />
      </View>
    )
  }
}

function select(state: any) {
  const {
    login: { isLoggedIn },
    calendarEvents: {
      type,
      addLoading,
      loading,
      events,
      eventsArr,
      deleteLoading,
    },
    profile,
    healthrelationCache: { patients, professionals },
  }: any = state

  const patient: any = Object.values(patients as PatientDtoType[]).find(
    findPatientSelf,
  )
  const physician: any = patient && professionals[patient.primaryPhysicianUuid]

  return {
    type,
    isLoggedIn,
    profile,
    physician,
    patient,
    addLoading,
    loading,
    deleteLoading,
    events,
    eventsArr,
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
  withKeyboardAvoidingView,
)(CalendarEventList)
