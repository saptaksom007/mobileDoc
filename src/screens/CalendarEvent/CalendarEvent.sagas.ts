import { put, takeLatest, call, takeEvery } from 'redux-saga/effects'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import Actions, { ActionTypes } from './CalendarEvent.actions'
import {
  addCalendarEventAsync,
  asyncGetPreSignedURLForUpload,
  asyncGetPreSignedURLForUploaledImage,
  deleteCalendarEventAsync,
  getCalendarEventAsnyc,
} from 'api/calendarEvents'
import { isArray } from 'lodash'
import moment from 'moment'
import { Alert, Keyboard, Platform } from 'react-native'
import {
  getExpoPickerFromPickerTypeAsync,
  resizePicture,
} from 'utilities/image'
import * as ImagePicker from 'expo-image-picker'
import i18n from 'ex-react-native-i18n'
import { api } from 'common-docdok'
import { Buffer } from 'buffer'

function* navigateToCalendarEventList() {
  yield put(NavAction.push('calendareventlist'))
}

function* navigateToCalendarEventLoadList() {
  yield put(NavAction.push('calendareventLoadList'))
}

function* navigateToCalendarEventAdd() {
  yield put(Actions.setCalendarEventAttachment(null))
  yield put(NavAction.push('calendarEventAdd'))
}

function* deleteCalendarEvent({ payload }: any) {
  try {
    yield call(deleteCalendarEventAsync, payload)
    yield put(Actions.deleteCalendarEventSucceeded())
    Alert.alert(i18n.t('events.remove.title'), i18n.t('events.remove.success'))
    yield put(
      Actions.getCalendarEventRequested({
        patient_uuid: payload?.patientRef,
        couch_uuid: payload?.coachRef,
        distinct: false,
      }),
    )
  } catch (err) {
    yield put(Actions.deleteCalendarEventFailed(err))
    // yield put(
    //   NavAction.showLocalError(i18n.t('appointment.errors.fetchAppointment')),
    // )
  }
}

function* addCalendarEvent({ payload }: any) {
  try {
    const event: any = yield call(addCalendarEventAsync, payload)
    yield put(Actions.addCalendarEventSucceeded(event))
    Alert.alert('', i18n.t('events.add.success'))

    yield put(
      Actions.getCalendarEventRequested({
        patient_uuid: payload?.patientUuid,
        couch_uuid: payload?.physicianUuid,
        distinct: payload?.distinct ?? false,
      }),
    )
  } catch (err) {
    yield put(Actions.addCalendarEventFailed(err))
    // yield put(
    //   NavAction.showLocalError(i18n.t('appointment.errors.fetchAppointment')),
    // )
  }
}

function* getCalendarEvent({ payload }: any) {
  try {
    let events: any = yield call(getCalendarEventAsnyc, payload)
    const eventsObj: any = {}
    if (isArray(events)) {
      events = events.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      )
      events.forEach((event: any) => {
        const date = moment(event.startTime).format('YYYY-MM-DD')
        if (eventsObj[date]) {
          eventsObj[date] = [event, ...eventsObj[date]]
        } else {
          eventsObj[date] = [event]
        }
      })
    }

    yield put(
      Actions.getCalendarEventSucceeded({
        eventsObj,
        events: payload?.distinct ? events : [],
      }),
    )
  } catch (err) {
    console.log('err is', err)
    yield put(Actions.getCalendarEventFailed(err))
    // yield put(
    //   NavAction.showLocalError(i18n.t('appointment.errors.fetchAppointment')),
    // )
  }
}

function* addAttachment({ payload: { imageFrom, id } }: any) {
  try {
    Keyboard.dismiss()
    const launchPickerAsync = yield call(
      getExpoPickerFromPickerTypeAsync,
      imageFrom,
    )
    const resultPicker = yield call(launchPickerAsync, {
      quality: 0.6,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS !== 'ios',
    })

    if (resultPicker.cancelled) {
      yield put(Actions.addAttachmentCancelled())
    } else {
      const { base64, uri } = yield call(resizePicture, resultPicker)
      const mimeTypeString = 'image/png'
      const fileName = String(uri)
        .split('/')
        .reverse()?.[0]
      const response = yield call(asyncGetPreSignedURLForUpload, {
        fileName,
        patientActivityId: id,
      })

      const { url } = response

      yield call(
        api.uploadFile,
        url,
        mimeTypeString,
        new Buffer(base64, 'base64'),
      )
    }
  } catch (error) {
    yield put(Actions.addAttachmentFailed())
  }
}

function* getAttachment({ payload: { id } }: any) {
  try {
    const response = yield call(asyncGetPreSignedURLForUploaledImage, {
      patientActivityId: id,
    })
    yield put(Actions.setCalendarEventAttachment(response?.url))
  } catch (error) {
    yield put(Actions.addAttachmentFailed())
  }
}

export default [
  takeLatest(
    ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_LIST,
    navigateToCalendarEventList,
  ),
  takeLatest(
    ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST,
    navigateToCalendarEventLoadList,
  ),
  takeLatest(
    ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_ADD,
    navigateToCalendarEventAdd,
  ),
  takeLatest(ActionTypes.ADD_CALENDAR_EVENT_REQUESTED, addCalendarEvent),
  takeLatest(ActionTypes.GET_CALENDAR_EVENT_REQUESTED, getCalendarEvent),
  takeEvery(ActionTypes.ADD_ATTACHMENT_REQUESTED, addAttachment),
  takeEvery(ActionTypes.DELETE_CALENDAR_EVENT_REQUESTED, deleteCalendarEvent),
  takeEvery(ActionTypes.GET_CALENDAR_EVENT_ATTACHMENT, getAttachment),
]
