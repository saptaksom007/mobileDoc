import React, { PureComponent } from 'react'
import { Platform } from 'react-native'
import * as Localization from 'expo-localization'
import * as Permissions from 'expo-permissions'
import * as Calendar from 'expo-calendar'
import { connect } from 'react-redux'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import {
  connectActionSheet,
  ActionSheetProps,
} from '@expo/react-native-action-sheet'
import i18n from 'ex-react-native-i18n'
import moment from 'moment'
import { propEq, propOr } from 'ramda'
import { compose } from 'recompose'

import { getTestId } from 'utilities/environment'
import HomeLink from 'components/HomeLink/HomeLink.component'
import { Action } from 'redux'

const testId = getTestId('export-calendar')

const isSupportedDevice = () =>
  Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version > 22)

const createEvent = async (
  appointment: any,
  calendarId: string,
  minutes: number = 15,
) => {
  const timeZone = Localization.timezone
  const event = {
    title: `[${i18n.t('appointment.subtitle')}] ${appointment.physician} / ${
      appointment.patientName
    }`,
    startDate: moment(appointment.appointmentTime).toDate(),
    endDate: moment(appointment.appointmentTime)
      .add({ minutes })
      .toDate(),
    timeZone,
    location: `${appointment.clinicName}\n${appointment.clinicStreet}\n${appointment.clinicLocation}`,
    alarms: [
      {
        relativeOffset: -60,
      },
    ],
  }
  const eventId = Calendar.createEventAsync(calendarId, event)
  return eventId
}

const getCalendarIndexAsync = (
  showActionSheetWithOptions: ActionSheetProps['showActionSheetWithOptions'],
  options: string[],
  cancelButtonIndex: number,
): Promise<number> =>
  new Promise((resolve: any) => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: i18n.t('exportAppointment.choose'),
      },
      buttonIndex => {
        if (buttonIndex !== cancelButtonIndex) {
          resolve(buttonIndex)
        }
      },
    )
  })

const exportToCalendar = async (
  appointment: any,
  showActionSheetWithOptions: ActionSheetProps['showActionSheetWithOptions'],
  dispatch: (action: Action) => void,
) => {
  try {
    if (!isSupportedDevice()) {
      dispatch(NavAction.showLocalWarning(i18n.t('error.deviceNotSupported')))
      return
    }
    const response = await Permissions.askAsync('calendar')
    const granted = response.status === 'granted'
    if (granted) {
      const eventCalendars = ((await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      )) as unknown) as any[]

      const filteredWritableCalendar = eventCalendars.filter(
        propEq('allowsModifications', true),
      )

      const calendar: { id: string | undefined } = { id: undefined }
      if (filteredWritableCalendar && filteredWritableCalendar.length) {
        // show eventCalendars
        if (filteredWritableCalendar.length === 1) {
          calendar.id = filteredWritableCalendar[0].id
        } else {
          // list all calendar
          const options: string[] = [
            ...filteredWritableCalendar.map<string>(propOr('unknown', 'title')),
            i18n.t('global.cancel'),
          ]

          const cancelButtonIndex = options.length - 1
          calendar.id =
            filteredWritableCalendar[
              await getCalendarIndexAsync(
                showActionSheetWithOptions,
                options,
                cancelButtonIndex,
              )
            ].id
        }
      } else {
        dispatch(
          NavAction.showLocalWarning(i18n.t('exportAppointment.noCalendar')),
        )
      }

      if (calendar.id) {
        // create event
        createEvent(appointment, calendar.id)
        dispatch(
          NavAction.showLocalNotice(i18n.t('exportAppointment.exportDone')),
        )
      }
    } else {
      dispatch(
        NavAction.showLocalWarning(i18n.t('exportAppointment.needPermission')),
      )
    }
  } catch (error) {
    dispatch(NavAction.showLocalError(i18n.t('error.default')))
  }
}

interface Props extends ActionSheetProps {
  appointment: any
  dispatch(action: Action): void
  isLoggedIn: boolean
}

export class ExportAppointmentLink extends PureComponent<Props> {
  render() {
    const {
      appointment,
      showActionSheetWithOptions,
      dispatch,
      isLoggedIn,
    } = this.props

    if (!isLoggedIn) {
      return null
    }

    return (
      <HomeLink
        title={i18n.t('exportAppointment.linkTitle')}
        onPress={() =>
          exportToCalendar(appointment, showActionSheetWithOptions, dispatch)
        }
        iconName='file-download'
        testID={testId}
      />
    )
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(({ login: { isLoggedIn } }: any) => ({ isLoggedIn })),
)(ExportAppointmentLink)
