import { put, all, takeEvery } from 'redux-saga/effects'
import { pathOr, pathEq } from 'ramda'
import * as Sentry from 'sentry-expo'

import MessagingSagas from 'common-docdok/lib/domain/messaging/sagas'
import UsersRootSagas from 'common-docdok/lib/domain/user/sagas'
import HealthrelationSagas from 'common-docdok/lib/domain/healthrelation/sagas'
import PersistStore from 'common-docdok/lib/configuration/persistStore'
import SurveyCommonSagas from 'common-docdok/lib/domain/survey/sagas'
import NotificationsSagas from 'notifications/sagas'
import SagaNavigation from 'navigation/SagaNavigation'

import LoginSagas from 'screens/Login/Login.sagas'
import ChatSagas from 'screens/Chat/Chat.sagas'
import DashboardSagas from 'screens/Dashboard/Dashboard.sagas'
import ProfileSagas from 'screens/Profile/Profile.sagas'
import SurveySagas from 'screens/Survey/Survey.sagas'
import ConversationsListSagas from 'screens/ConversationsList/ConversationsList.sagas'
import AppointmentSagas from 'screens/Appointment/Appointment.sagas'
import AppointmentsListSagas from 'screens/AppointmentsList/AppointmentsList.sagas'
import PhotoViewerSagas from 'screens/PhotoViewer/PhotoViewer.sagas'
import DossierDetailSagas from 'screens/DossierDetail/DossierDetail.sagas'
import BookAppointmentSagas from 'screens/BookAppointment/BookAppointment.sagas'
import PdfReaderSagas from 'screens/PdfReader/PdfReader.sagas'
import AppointmentConfirmationSagas from 'screens/AppointmentConfirmation/AppointmentConfirmation.sagas'
import GraphicSagas from 'screens/Graphic/Graphic.sagas'
import CalendarEventSagas from 'screens/CalendarEvent/CalendarEvent.sagas'

// PREPEND SAGAS IMPORT HERE

const matchFailedActionType = ({ type }: { type: string }) =>
  type.endsWith('_FAILED') || type.endsWith('_ERR')

const isAccessDeniedError = pathEq(['error', 'response', 'status'], 403)
const isRefreshTokenError = pathEq(['error', 'refreshTokenError'], true)

/**
 * Send sentry alert
 * @param {any} { message, type, error }
 */
const catchFailed = function* catchFailedFn({
  message,
  type,
  error,
  payload,
}: {
  message: string
  type: string
  error: Error
  payload: { error: any }
}): Iterable<any> {
  if (!isAccessDeniedError(payload) && !isRefreshTokenError(payload)) {
    const errApi = pathOr(
      (error && error.message) || message || type || 'no error message',
      ['error', 'response', 'data', 'message'],
      payload,
    )

    if (!__DEV__) {
      Sentry.Native.captureException(
        (errApi && new Error(errApi)) || error || payload.error,
      )
    } else {
      const captureMessage: string = `[${type}] ${message ||
        (error && error.message) ||
        (payload && payload.error && payload.error.message) ||
        'unknow error message'}`
      console.warn(`[DEBUG] ${errApi}`)
      console.warn(`[DEBUG] ${captureMessage}`)
    }
    yield put({ type: 'CATCH_ERROR', payload })
  }
}

const rootSagas = function* root(): Iterable<any> {
  yield all([
    ...PersistStore.persistSagas(),
    ...(HealthrelationSagas() as any),
    ...MessagingSagas(),
    ...(SurveyCommonSagas() as any),
    ...UsersRootSagas(),
    ...AppointmentSagas,
    ...AppointmentsListSagas,
    ...ConversationsListSagas,
    ...ChatSagas,
    ...DashboardSagas,
    ...DossierDetailSagas,
    ...LoginSagas,
    ...NotificationsSagas,
    ...ProfileSagas,
    ...PhotoViewerSagas,
    ...SagaNavigation,
    ...SurveySagas,
    ...BookAppointmentSagas,
    ...PdfReaderSagas,
    ...AppointmentConfirmationSagas,
    ...GraphicSagas,
    ...CalendarEventSagas,
    // PREPEND SAGAS HERE
    takeEvery(matchFailedActionType, catchFailed),
  ])
}

export default rootSagas
