import { put, takeEvery } from 'redux-saga/effects'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import i18n from 'ex-react-native-i18n'

import Actions, { ActionTypes } from './Survey.actions'

function* gotoSurveyWebView({ payload: { url, patientId } }: any) {
  try {
    yield put(NavAction.push('surveywebview', { url, patientId }))
    yield put(Actions.selectSurveySucceeded())
  } catch (err) {
    yield put(Actions.selectSurveyFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('surveys.errors.gotoSurveyWebView')),
    )
  }
}

export default [
  takeEvery(ActionTypes.SELECT_SURVEY_REQUESTED, gotoSurveyWebView),
]
