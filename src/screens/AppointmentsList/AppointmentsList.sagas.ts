import { call, put, select, takeEvery } from 'redux-saga/effects'
import { pathOr, filter, last, pipe } from 'ramda'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import i18n from 'ex-react-native-i18n'

import { ActionTypes as LoginActionTypes } from 'screens/Login/Login.actions'
import { asyncAction } from 'common-docdok/lib/utils/sagaUtils'

import { ActionTypes as ScheduleAppointmentActionTypes } from 'screens/ScheduleAppointment/ScheduleAppointment.actions'

import Actions, { ActionTypes } from './AppointmentsList.actions'
import {
  filterOldAppointment,
  fetchAppointmentsListAsync,
} from 'api/appointments'

const isLoggedInSelector = pathOr(false, ['login', 'isLoggedIn'])

const getLatestNotification = pipe(
  pathOr([], ['notifications', 'notificationsList']),
  // @ts-ignore
  filter((notif: any) => notif.origin === 'selected'),
  last,
)

const getAppointmentsList = pipe(
  pathOr([], ['appointmentslist', 'rawList']),
  filterOldAppointment,
)

const getMarkAsReadAppointmentIds = pathOr(
  [],
  ['appointmentslist', 'markAsRead'],
)

const getScheduleAppointments = pipe(
  pathOr([], ['scheduleappointment', 'cacheAppointments']),
)

const noScheduleAppointment = (cacheAppointments: number[]) => (
  appointment: any,
) => !cacheAppointments.includes(appointment.id)

const addMarkAsReadProperty = (app: any[], ids: number[]) =>
  app.reduce(
    (accumulator, current) => [
      ...accumulator,
      ids.includes(current.id)
        ? { ...current, markAsRead: true }
        : { ...current, markAsRead: false },
    ],
    [],
  )

function* fetchAppointmentsList() {
  try {
    const rawList = yield call(fetchAppointmentsListAsync)
    const cacheAppointments: number[] = yield select(getScheduleAppointments)

    if (rawList) {
      const appointmentWithoutSchedule = rawList.filter(
        noScheduleAppointment(cacheAppointments),
      )
      const readIds: number[] = yield select(getMarkAsReadAppointmentIds)

      const appointmentList = addMarkAsReadProperty(
        appointmentWithoutSchedule,
        readIds.concat(cacheAppointments),
      )
      yield put(Actions.appointmentsListSucceeded(appointmentList))
    } else {
      yield put(Actions.appointmentsListSucceeded([]))
    }
  } catch (err) {
    yield put(Actions.appointmentsListFailed(err))
    yield put(
      NavAction.showLocalError(
        i18n.t('appointmentslist.errors.fetchAppointmentsListAsync'),
        'login',
      ),
    )
  }
}

function* fetchAppointmentsListOnStartup() {
  try {
    yield asyncAction(Actions.appointmentsListRequested())
    const rawList = yield select(getAppointmentsList)
    if (rawList && rawList.length > 0) {
      const isLoggedIn = yield select(isLoggedInSelector)
      if (!isLoggedIn) {
        const latestNotification = yield select(getLatestNotification)
        if (
          !latestNotification ||
          (latestNotification &&
            latestNotification.addedAt > Date.now() + 10000)
        ) {
          yield put(NavAction.push('Appointment'))
        }
      }
    }
  } catch (err) {
    yield put(Actions.appointmentsListFailed(err))
    yield put(
      NavAction.showLocalError(
        i18n.t('appointmentslist.errors.fetchAppointmentsListAsync'),
        'login',
      ),
    )
  }
}

export default [
  takeEvery(
    LoginActionTypes.GET_LIMITED_ACCESS_TOKEN_SUCCEEDED,
    fetchAppointmentsListOnStartup,
  ),
  takeEvery(ActionTypes.APPOINTMENTSLIST_REQUESTED, fetchAppointmentsList),
  takeEvery(
    ScheduleAppointmentActionTypes.SCHEDULE_APPOINTMENT,
    fetchAppointmentsList,
  ),
]
