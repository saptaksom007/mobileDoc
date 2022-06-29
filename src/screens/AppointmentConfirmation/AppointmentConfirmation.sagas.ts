import { call, put, takeEvery } from 'redux-saga/effects'

import Actions, { ActionTypes } from './AppointmentConfirmation.actions'
import i18n from 'ex-react-native-i18n'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { fetchAppointmentByIdAsync } from 'api/appointments'

function* fetchAppointmentConfirmation({ payload: id }: any) {
  try {
    const appointment = yield call(fetchAppointmentByIdAsync, { id })
    yield put(Actions.appointmentConfirmationSucceeded(appointment))
  } catch (err) {
    yield put(Actions.appointmentConfirmationFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('appointment.errors.fetchAppointment')),
    )
  }
}

export default [
  takeEvery(
    ActionTypes.APPOINTMENT_CONFIRMATION_REQUESTED,
    fetchAppointmentConfirmation,
  ),
]
