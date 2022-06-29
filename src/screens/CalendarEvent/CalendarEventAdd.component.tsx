import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Switch,
  Alert,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withKeyboardAvoidingView from 'screens/enhancers/withKeyboardAvoidingView'

import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'

import styles from './CalendarEvents.styles'
import Actions from './CalendarEvent.actions'
import { PatientDtoType } from 'common-docdok/lib/domain/healthrelation/types/patientDto'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'
import { Formik } from 'formik'
import { AppTextInput } from 'components/AppTextInput/AppTextInput.component'
import i18n from 'ex-react-native-i18n'
import { AppDatetimePicker } from 'components/AppDatetimePicker/AppDatetimePicker.component'
import { Button, Icon } from 'react-native-elements'
import { AppRichTextAreaComponent } from 'components/AppRichTextArea/AppRichTextArea.component'
import { AddCalendarEventReqPayloadInterface } from 'api/calendarEvents'
import moment from 'moment'
import { convertJAVADurationToMinutes } from 'utilities/number'
import * as Yup from 'yup'
import CalendarEventActions from 'screens/CalendarEvent/CalendarEvent.actions'

import calendarConstants from './constants/calendarConstants'
import { Color } from 'constants/Color'
import {
  connectActionSheet,
  ActionSheetProps,
} from '@expo/react-native-action-sheet'
import { isArray } from 'lodash'
import { hasOnlyOneConversation } from 'common-docdok/lib/domain/messaging/selectors/findConversation'
import primaryConSelector from 'common-docdok/lib/domain/messaging/selectors/primaryConSelector'
// @ts-ignore
import RadioForm from 'react-native-simple-radio-button'

const activityDetails = {
  activityName: '',
  duration: '',
  startTime: new Date(),
  startTimeDate: new Date(),
  description: '',
  location: '',
  status: 0,
  endTime: moment()
    .add(15, 'minutes')
    .toDate(),
  endTimeDate: moment()
    .add(1, 'day')
    .toDate(),
  reccurence: false,
  reccurenceVal: 'daily',
  reccurenceValChild: null,
  type: '',
  statusValue: 0,
}

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<any>
  isLoggedIn: boolean
  currentItem: any
  addLoading: boolean
  profile: any
  physician: any
  patient: any
  events: any[]
  loading: boolean
  type: any
  forceConversationId: number
  primaryConversationId: number
  scheduleAppointment: number
  patients: Array<{ firstName: string; clinicId: number }>
  onlyOneConversation: boolean
  attachmentURL: any
}

interface State {
  moreOptions: boolean
  visible: boolean
  addView: boolean
  currentType: string
}

const types = ['exercise', 'nutrition', 'activity']

const isSameOrAfter = (startTime: any, endTime: any) => {
  return moment(endTime).isSameOrAfter(moment(startTime))
}

export class CalendarEventAdd extends Component<Props, State> {
  formikRef: any

  constructor(props: Props) {
    super(props)
    this.addCalendarEvent = this.addCalendarEvent.bind(this)
    this.onAddAttachment = this.onAddAttachment.bind(this)
  }
  state = {
    visible: false,
    addView: false,
    moreOptions: false,
    currentType: '',
  }

  otherDoctorInput: any

  scrollView: any

  componentDidMount() {
    const { dispatch, currentItem } = this.props
    if (currentItem?.data?.id) {
      dispatch(
        Actions.getCalendarEventAttachment({ id: currentItem?.data?.id }),
      )
    }
  }

  activityFormSchema = Yup.object().shape({
    activityName: Yup.string()
      .min(2, i18n.t('events.add.validation.short'))
      .max(50, i18n.t('events.add.validation.long'))
      .required(i18n.t('events.add.validation.required')),
    startTime: Yup.string().required(i18n.t('events.add.validation.required')),
    startTimeDate: Yup.string().required(
      i18n.t('events.add.validation.required'),
    ),
    reccurence: Yup.boolean().required(
      i18n.t('events.add.validation.required'),
    ),
    endTime: Yup.string().test(
      'end_time_test',
      i18n.t('events.add.validation.endTime'),
      function(value) {
        const { startTime } = this.parent
        return isSameOrAfter(startTime, value)
      },
    ),
  })

  onAddAttachment(type: string, id: any) {
    const { dispatch } = this.props
    dispatch(Actions.addAttachmentRequested({ imageFrom: type, id }))
  }

  onDeleteEvent(data: any) {
    const {
      dispatch,
      physician,
      patient,
      onlyOneConversation,
      forceConversationId,
      primaryConversationId,
      patients,
      scheduleAppointment,
    } = this.props
    Alert.alert(
      i18n.t('events.remove.title'),
      i18n.t('events.remove.message'),
      [
        {
          text: i18n.t('events.remove.cancle'),
          onPress: () => {},
        },
        {
          text: i18n.t('events.remove.ok'),
          onPress: () => {
            dispatch(
              Actions.deleteCalendarEventRequested({
                patientRef: patient?.uuid,
                coachRef: physician?.uuid,
                id: data.id,
                isSeries: true,
                cb: () => {
                  dispatch(
                    CalendarEventActions.navigateToCalendarEventList(
                      Boolean(onlyOneConversation || forceConversationId),
                      forceConversationId || primaryConversationId,
                      patients?.[0]?.clinicId,
                      scheduleAppointment,
                    ),
                  )
                },
              }),
            )
          },
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  addCalendarEvent(values: any, setSubmitting: (submitting: boolean) => void) {
    const {
      dispatch,
      physician,
      patient,
      currentItem,
      onlyOneConversation,
      forceConversationId,
      primaryConversationId,
      patients,
      scheduleAppointment,
    } = this.props

    const reqPayload: AddCalendarEventReqPayloadInterface = {
      type: String(values.type).toLowerCase(),
      patientUuid: patient?.uuid,
      physicianUuid: physician?.uuid,
      name: values.activityName,
      startTime: moment(
        `${moment(values.startTimeDate).format('YYYY-MM-DD')} ${moment(
          values.startTime,
        ).format('HH:mm:ss')}`,
      ).format('YYYY-MM-DDTHH:mm:ssZ'),
      endTime: moment(
        `${moment(values.startTimeDate).format('YYYY-MM-DD')} ${moment(
          values.endTime,
        ).format('HH:mm:ss')}`,
      ).format('YYYY-MM-DDTHH:mm:ssZ'),
      url: '',
      description: values.description ? values.description : '-',
      status: values.status === 1 ? 'DONE' : 'SCHEDULED',
      location: values.location ?? '-',
      pattern:
        values.reccurence && values.reccurenceVal
          ? String(values.reccurenceVal).toLowerCase()
          : null,
      seriesEndDate: values.endTimeDate
        ? moment(values.endTimeDate).format('YYYY-MM-DDTHH:mm:ssZ')
        : null,
      cb: () => {
        setSubmitting(false)
        dispatch(
          CalendarEventActions.navigateToCalendarEventList(
            Boolean(onlyOneConversation || forceConversationId),
            forceConversationId || primaryConversationId,
            patients?.[0]?.clinicId,
            scheduleAppointment,
          ),
        )
      },
    }

    if (currentItem?.data?.id) {
      reqPayload.id = currentItem?.data?.id
    }
    try {
      dispatch(Actions.addCalendarEventRequested(reqPayload))
    } catch (error) {
      setSubmitting(false)
    }
  }

  openActionSheet(setType: any) {
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
        if (buttonIndex <= 2) {
          setType('type', types[buttonIndex])
        }
      },
    )
  }

  render() {
    const { isLoggedIn, currentItem, type, attachmentURL } = this.props

    console.log('attachmentURL is', attachmentURL)
    const eventType: 'activity' | 'nutrition' | 'exercise' =
      currentItem?.data?.type ?? currentItem?.type ?? type?.type

    if (!isLoggedIn) {
      return null
    }

    let initialValues = activityDetails
    if (currentItem?.data) {
      initialValues = {
        ...initialValues,
        ...currentItem?.data,
        activityName: currentItem?.data?.name,
        duration: convertJAVADurationToMinutes(currentItem?.data?.duration),
        startTimeDate: currentItem?.data?.startTime
          ? new Date(currentItem?.data?.startTime)
          : new Date(),
        startTime: currentItem?.data?.startTime
          ? new Date(currentItem?.data?.startTime)
          : new Date(),
        endTime: currentItem?.data?.endTime
          ? new Date(currentItem?.data?.endTime)
          : moment()
              .add(15, 'minutes')
              .toDate(),
        type: eventType,
        status: currentItem?.data?.status === 'DONE' ? 1 : 0,
      }
      let content: any = {}
      try {
        content = JSON.parse(currentItem?.data?.description)
      } catch (error) {}
      if (content?.blocks && isArray(content?.blocks)) {
        initialValues.description = content?.blocks?.[0]?.text
      }
    }

    console.log({ initialValues })
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps='always'
      >
        <Formik
          innerRef={p => (this.formikRef = p)}
          validationSchema={this.activityFormSchema}
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) =>
            this.addCalendarEvent(values, setSubmitting)
          }
        >
          {({
            values,
            setFieldValue,
            errors,
            handleSubmit,
            isSubmitting,
            dirty,
          }) => (
            <View style={styles.padder}>
              {console.log({ errors })}
              <View style={[styles.row, styles.spaceBetween]}>
                <Icon
                  type='ionicon'
                  name='close'
                  onPress={() => {
                    this.props.navigation.goBack()
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.openActionSheet(setFieldValue)
                  }}
                  style={styles.rowCenter}
                >
                  <Icon
                    size={18}
                    iconStyle={{ fontWeight: '600' }}
                    type={calendarConstants?.eventsIcons?.[values.type]?.type}
                    name={calendarConstants?.eventsIcons?.[values.type]?.name}
                    containerStyle={{ marginLeft: 12 }}
                  />
                  <Text style={{ fontWeight: '600', fontSize: 18 }}>
                    {String(i18n.t(values.type)).toUpperCase()}
                  </Text>
                  <Icon
                    type='font-awesome'
                    name='chevron-circle-down'
                    color={calendarConstants?.eventsIcons?.[values.type]?.color}
                    containerStyle={{ marginLeft: 12 }}
                  />
                </TouchableOpacity>
                <View />
              </View>
              <AppTextInput
                placeholder={i18n.t('events.add.title')}
                leftIcon={require('assets/images/Background.png')}
                onChangeText={text => {
                  setFieldValue('activityName', text)
                }}
                error={errors?.activityName}
                value={values.activityName}
              />
              <AppDatetimePicker
                placeholder={i18n.t('events.add.date')}
                mode='date'
                date={values?.startTimeDate ?? new Date()}
                onChange={text => {
                  setFieldValue('startTimeDate', text)
                  setFieldValue('endTimeDate', text)
                }}
                error={errors?.startTimeDate && String(errors?.startTimeDate)}
              />

              <View style={styles.row}>
                <View style={styles.flex}>
                  <AppDatetimePicker
                    minimumDate={moment()
                      .startOf('date')
                      .toDate()}
                    date={values?.startTime ?? new Date()}
                    placeholder={i18n.t('events.add.startTime')}
                    mode='time'
                    onChange={text => {
                      setFieldValue('startTime', text)
                      setFieldValue(
                        'endTime',
                        moment(text)
                          .add('15', 'minutes')
                          .toDate(),
                      )
                    }}
                    error={errors?.startTime && String(errors?.startTime)}
                  />
                </View>
                <View style={styles.flex}>
                  <AppDatetimePicker
                    minimumDate={moment(values.startTime)
                      .add(15, 'minutes')
                      .toDate()}
                    date={
                      values?.endTime ??
                      moment(values.startTime)
                        .add(15, 'minutes')
                        .toDate()
                    }
                    placeholder={i18n.t('events.add.endTime')}
                    mode='time'
                    onChange={text => {
                      setFieldValue('endTime', text)
                    }}
                    error={errors?.endTime && String(errors?.endTime)}
                  />
                </View>
              </View>
              <Text>{i18n.t('status')}</Text>
              <RadioForm
                formHorizontal
                radio_props={[
                  { label: `${i18n.t('SCHEDULED')}  `, value: 0 },
                  { label: i18n.t('DONE'), value: 1 },
                ]}
                initial={values.status ?? 0}
                buttonColor={
                  calendarConstants?.eventsIcons?.[values.type]?.color ??
                  Color.blueD
                }
                selectedButtonColor={
                  calendarConstants?.eventsIcons?.[values.type]?.color ??
                  Color.blueD
                }
                onPress={(value: any) => {
                  setFieldValue('status', value)
                }}
              />
              <AppTextInput
                placeholder={i18n.t('events.add.location')}
                leftIcon={require('assets/images/Background.png')}
                onChangeText={text => {
                  setFieldValue('location', text)
                }}
                error={errors?.location}
                value={values?.location}
                icon={<Icon name='location-on' />}
              />
              <View style={{ height: 400 }}>
                <AppRichTextAreaComponent
                  value={values.description}
                  onChangeText={text => {
                    setFieldValue('description', text)
                  }}
                  onAddAttachment={mediaType =>
                    this.onAddAttachment(mediaType, currentItem?.data?.id)
                  }
                  attachment={currentItem?.data?.id}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({ moreOptions: !this.state.moreOptions })
                }
              >
                <View style={styles.rowCenter}>
                  <Text>{i18n.t('events.add.more_option')}</Text>
                  <Icon
                    name={this.state.moreOptions ? 'caret-down' : 'caret-right'}
                    type='font-awesome'
                    color={Color.black}
                    iconStyle={{ marginLeft: 12 }}
                  />
                </View>
              </TouchableWithoutFeedback>

              {this.state.moreOptions && (
                <>
                  <View style={styles.row}>
                    <Text style={{ marginRight: 8 }}>
                      {i18n.t('events.add.reccurence')}
                    </Text>
                    <Switch
                      trackColor={{ false: '#eeeeee', true: '#e5d1fe' }}
                      thumbColor={values.reccurence ? '#26debd' : '#c4c4c4'}
                      onValueChange={() => {
                        setFieldValue('reccurence', !values.reccurence)
                      }}
                      value={values.reccurence}
                    />
                  </View>
                  {values.reccurence && (
                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue('reccurenceVal', 'daily')
                        }}
                        style={[
                          styles.flex,
                          values.reccurenceVal === 'daily' &&
                            styles.textBtnActive,
                        ]}
                      >
                        <View style={styles.flex}>
                          <Text style={[styles.textBtn]}>
                            {i18n.t('events.add.daily')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue('reccurenceVal', 'weekly')
                        }}
                        style={[
                          styles.flex,
                          values.reccurenceVal === 'weekly' &&
                            styles.textBtnActive,
                        ]}
                      >
                        <View style={styles.flex}>
                          <Text style={[styles.textBtn]}>
                            {i18n.t('events.add.weekly')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFieldValue('reccurenceVal', 'monthly')
                        }}
                        style={styles.flex}
                      >
                        <View
                          style={[
                            styles.flex,
                            values.reccurenceVal === 'monthly' &&
                              styles.textBtnActive,
                          ]}
                        >
                          <Text style={[styles.textBtn]}>
                            {i18n.t('events.add.monthly')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {values.reccurence && (
                    <>
                      <AppDatetimePicker
                        minimumDate={moment(values.startTimeDate).toDate()}
                        date={
                          values?.endTimeDate ??
                          moment(values.startTimeDate)
                            .add('1', 'day')
                            .toDate()
                        }
                        placeholder={i18n.t('events.add.endDate')}
                        mode='date'
                        onChange={text => {
                          setFieldValue('endTimeDate', text)
                        }}
                      />
                    </>
                  )}
                </>
              )}
              {attachmentURL !== null ? (
                <Image source={{ uri: attachmentURL }} style={styles.img} />
              ) : null}
              <View style={styles.rowCenter}>
                {currentItem?.data?.id && (
                  <Button
                    buttonStyle={[
                      styles.saveBtn,
                      {
                        backgroundColor: Color.blackTT,
                      },
                    ]}
                    title={i18n.t('events.remove.title')}
                    onPress={() => {
                      this.onDeleteEvent({
                        id: currentItem?.data?.id,
                      })
                    }}
                  />
                )}
                <Button
                  disabled={!dirty}
                  buttonStyle={[
                    styles.saveBtn,
                    {
                      backgroundColor:
                        calendarConstants?.eventsIcons?.[values.type]?.color,
                    },
                  ]}
                  title={
                    this.props.addLoading || isSubmitting
                      ? i18n.t('events.add.loading')
                      : i18n.t(
                          currentItem?.data?.id
                            ? 'events.add.update'
                            : 'events.add.save',
                        )
                  }
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    )
  }
}

function select(state: any) {
  const {
    login: { isLoggedIn },
    calendarEvents: {
      currentItem,
      addLoading,
      loading,
      events,
      type,
      deleteLoading,
      attachmentURL,
    },
    profile,
    healthrelationCache: { patients, professionals },
    messaging,
    scheduleappointment,
  }: any = state

  const patient: any = Object.values(patients as PatientDtoType[]).find(
    findPatientSelf,
  )
  const primaryConversationId = patient
    ? primaryConSelector(state, patient.uuid)
    : undefined
  const physician: any = patient && professionals[patient.primaryPhysicianUuid]
  const onlyOneConversation = hasOnlyOneConversation(
    Object.values(messaging.conversations),
  )
  return {
    currentItem,
    isLoggedIn,
    profile,
    physician,
    patient,
    addLoading,
    loading,
    events,
    type,
    deleteLoading,
    onlyOneConversation,
    patients,
    primaryConversationId,
    scheduleAppointment: scheduleappointment,
    attachmentURL,
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
  withKeyboardAvoidingView,
)(CalendarEventAdd)
