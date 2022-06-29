import React, { Component } from 'react'

import {
  View,
  ScrollView,
  InteractionManager,
  StyleSheet,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import i18n from 'ex-react-native-i18n'
import { Divider, Button, FormInput } from 'react-native-elements'

import {
  BookAppointmentDate,
  BookAppointmentDayOfWeek,
  BookAppointmentTime,
  BookAppointmentDateValues,
  BookAppointmentDayOfWeekValues,
  BookAppointmentTimeValues,
} from 'api/types'
import withSubtitle from 'screens/enhancers/withSubtitle'
import withKeyboardAvoidingView from 'screens/enhancers/withKeyboardAvoidingView'
import { Color } from 'constants/Color'
import Options from './components/Options/Options.component'
import {
  fontFamily,
  fontFamilyBold,
} from 'components/CustomText/CustomText.styles'
import { Heading3 } from 'components/CustomText/CustomText.component'

import { getTestId } from 'utilities/environment'
import ScheduleAppointmentActions from 'screens/ScheduleAppointment/ScheduleAppointment.actions'

import Actions from './BookAppointment.actions'

import { OptionType } from './BookAppointment.types'
import { Action } from 'redux'
import { NavigationScreenProp } from 'react-navigation'
import { isDayStillInThisWorkWeek } from 'utilities/date'

const styles = StyleSheet.create({
  container: {},
  preference: {
    paddingVertical: 7,
  },
  requestBtn: {
    paddingHorizontal: 34,
  },
  subtitle: {
    marginLeft: 10,
    color: Color.black,
    fontFamily,
  },
  formInputText: {
    color: '#000',
  },
  formInput: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: Platform.select({ ios: 15, android: 0 }),
    backgroundColor: '#f0efef',
    color: '#c4c4c4',
    borderRadius: 5,
  },
})

const requestAppointmentTestId = getTestId('request-appointment')
const inputRequestAppointmentTestId = getTestId('input-request-appointment')

const mapName = (doctor: any) =>
  `${
    doctor.salutation.endsWith('.')
      ? doctor.salutation
      : `${doctor.salutation}.`
  }${
    doctor.firstName ? ` ${doctor.firstName.substr(0, 1).toUpperCase()}.` : ''
  } ${doctor.lastName}`

const mapValue = (value: any) =>
  Object.values(value).map((key: any) => i18n.t(`bookappointment.${key}`))

const MAX_LENGTH = 128

interface Props {
  dispatch(action: Action): void
  navigation: NavigationScreenProp<any>
  preferredDate: BookAppointmentDate
  preferredDayOfWeek: BookAppointmentDayOfWeek
  preferredTimeOfDay: BookAppointmentTime
  preferredDoctor: number
  doctors: any[]
  doctorsOptions: string[]
  otherDoctor: string
  scheduleAppointment?: number
  other?: boolean
}

interface State {
  doctorsOptions: string[]
}

export class BookAppointment extends Component<Props, State> {
  static defaultProps: {
    doctorsOptions: []
  }

  componentDidMount() {
    const { dispatch } = this.props
    InteractionManager.runAfterInteractions(() => {
      dispatch(Actions.initBookingAppointment())
    })
  }

  otherDoctorInput: any

  selectOption = (option: { [key: string]: OptionType }) =>
    this.props.dispatch(Actions.selectOption(option))

  scrollView: any

  navigateToChat = () => {
    const {
      dispatch,
      preferredDoctor,
      doctors,
      navigation: {
        state: {
          params: { conversationId },
        },
      },
      scheduleAppointment,
    } = this.props

    dispatch(
      Actions.navigateToChat(
        doctors[preferredDoctor - 1] && doctors[preferredDoctor - 1].userRef,
        conversationId,
      ),
    )
    InteractionManager.runAfterInteractions(() => {
      if (scheduleAppointment) {
        dispatch(
          ScheduleAppointmentActions.scheduleAppointment(scheduleAppointment),
        )
      }
      dispatch(Actions.initBookingAppointment())
    })
  }

  selectOtherDoctor = (index?: number) => {
    const { doctorsOptions } = this.props
    this.selectOption({
      preferredDoctor: index,
      other: index === doctorsOptions.length - 1,
    })
    InteractionManager.runAfterInteractions(() => {
      if (this.otherDoctorInput) {
        this.otherDoctorInput.focus()
      }
    })
  }

  render() {
    const {
      preferredDate,
      preferredDayOfWeek,
      preferredTimeOfDay,
      preferredDoctor,
      doctorsOptions,
      otherDoctor,
      other,
      dispatch,
    } = this.props

    const disabledButton =
      preferredDate === 'urgent' ||
      (other &&
        ((otherDoctor && otherDoctor.trim() === '') ||
          otherDoctor === undefined ||
          otherDoctor === '')) ||
      (preferredDate === 'thisWeek' &&
        preferredDayOfWeek !== 'anyDayOfWeek' &&
        !isDayStillInThisWorkWeek(preferredDayOfWeek))

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='never'
        >
          <Options
            style={styles.preference}
            title={i18n.t('bookappointment.preferredDate')}
            values={mapValue(BookAppointmentDateValues)}
            selectedIndex={BookAppointmentDateValues.indexOf(preferredDate)}
            onPress={index =>
              this.selectOption({
                preferredDate: BookAppointmentDateValues[index],
              })
            }
          />
          <Divider />
          <Options
            style={styles.preference}
            title={i18n.t('bookappointment.preferredDayOfWeek')}
            values={mapValue(BookAppointmentDayOfWeekValues)}
            selectedIndex={BookAppointmentDayOfWeekValues.indexOf(
              preferredDayOfWeek,
            )}
            onPress={index =>
              this.selectOption({
                preferredDayOfWeek: BookAppointmentDayOfWeekValues[index],
              })
            }
          />
          <Divider />
          <Options
            style={styles.preference}
            title={i18n.t('bookappointment.preferredTimeOfDay')}
            values={mapValue(BookAppointmentTimeValues)}
            selectedIndex={BookAppointmentTimeValues.indexOf(
              preferredTimeOfDay,
            )}
            onPress={index =>
              this.selectOption({
                preferredTimeOfDay: BookAppointmentTimeValues[index],
              })
            }
          />
          <Divider />
          <Options
            style={styles.preference}
            title={i18n.t('bookappointment.preferredDoctor')}
            values={doctorsOptions}
            selectedIndex={preferredDoctor}
            onPress={index => this.selectOtherDoctor(index)}
          />
          {other && (
            <View>
              <Divider />
              <View
                style={styles.preference}
                testID={inputRequestAppointmentTestId}
                accessibilityLabel={inputRequestAppointmentTestId}
              >
                <Heading3 style={styles.subtitle}>
                  {i18n.t('bookappointment.otherDoctorTitle')}
                </Heading3>
                <FormInput
                  ref={ref => (this.otherDoctorInput = ref)}
                  maxLength={MAX_LENGTH}
                  onChangeText={text =>
                    dispatch(Actions.changeOtherDoctor(text))
                  }
                  placeholder={i18n.t('bookappointment.otherDoctorPlaceholder')}
                  underlineColorAndroid={'#f0efef'}
                  inputStyle={styles.formInputText}
                  containerStyle={styles.formInput}
                  autoCorrect={false}
                />
              </View>
            </View>
          )}
          <Divider />
          <View style={styles.preference}>
            <Heading3 style={styles.subtitle}>
              {i18n.t('bookappointment.reasonForAppointment')}
            </Heading3>
            <FormInput
              testID={inputRequestAppointmentTestId}
              accessibilityLabel={inputRequestAppointmentTestId}
              maxLength={MAX_LENGTH}
              onChangeText={text =>
                dispatch(Actions.changeReasonForAppointment(text))
              }
              placeholder={i18n.t(
                'bookappointment.reasonForAppointmentPlaceholder',
              )}
              underlineColorAndroid={'#f0efef'}
              inputStyle={styles.formInputText}
              containerStyle={styles.formInput}
              autoCorrect={false}
            />
          </View>

          <Button
            testID={requestAppointmentTestId}
            accessibilityLabel={requestAppointmentTestId}
            style={styles.requestBtn}
            title={i18n.t('bookappointment.requestAppointment')}
            icon={{ name: 'check' }}
            backgroundColor={'#8950b7'}
            disabled={disabledButton}
            fontFamily={fontFamilyBold}
            onPress={this.navigateToChat}
            buttonStyle={{
              borderRadius: 12,
            }}
          />
        </ScrollView>
      </View>
    )
  }
}

function select({
  bookappointment: {
    preferredDate,
    preferredDayOfWeek,
    preferredTimeOfDay,
    preferredDoctor,
    otherDoctor,
    clinicId,
    other,
  },
  healthrelationCache: { professionals },
}: any): any {
  const professionalsValues: any[] = Object.values(professionals)
  const doctors =
    (clinicId &&
      professionalsValues.filter((doc: any) => doc.clinicId === clinicId)) ||
    []
  const doctorsOptions = [
    i18n.t('bookappointment.anyDoctor'),
    ...doctors.map(mapName),
    i18n.t('bookappointment.otherDoctor'),
  ]
  return {
    preferredDate,
    preferredDayOfWeek,
    preferredTimeOfDay,
    preferredDoctor,
    doctors,
    doctorsOptions,
    otherDoctor,
    other,
  }
}

export default compose<Props, any>(
  connect(select),
  withKeyboardAvoidingView,
  withSubtitle('bookappointment.subtitle'),
)(BookAppointment)
