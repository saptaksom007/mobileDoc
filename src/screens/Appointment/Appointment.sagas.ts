import { call, put, takeEvery } from 'redux-saga/effects'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import i18n from 'ex-react-native-i18n'

import Actions from './Appointment.actions'
import { fetchAppointmentByIdAsync } from 'api/appointments'

function* fetchAppointment({ id }: any) {
  try {
    const appointment = yield call(fetchAppointmentByIdAsync, { id })
    yield put(Actions.appointmentSucceeded(appointment))
  } catch (err) {
    yield put(Actions.appointmentFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('appointment.errors.fetchAppointment')),
    )
  }
}

export default [takeEvery('APPOINTMENT_REQUESTED', fetchAppointment)]
