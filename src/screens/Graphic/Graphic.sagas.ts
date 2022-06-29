import { put, takeEvery, select } from 'redux-saga/effects'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import Actions, { ActionTypes } from './Graphic.actions'
import { pathOr, pipe, filter, map, sortWith, ascend, prop } from 'ramda'
import { surveyActions } from 'common-docdok/lib/domain/survey/actions'
import { asyncAction } from 'common-docdok/lib/utils/sagaUtils'
import { SurveyParticipationDtoType } from 'common-docdok/lib/types'
import { Action } from 'redux'
import { RawData } from './RawData'

const filterBySurveyId = (surveyId: string | number) => (
  survey: SurveyParticipationDtoType,
) => survey.surveyId === Number(surveyId)

const getScore = (score?: string[]): number => {
  if (!score || score.length === 0) {
    return 0
  }
  const joinScore = score.join('')
  if (joinScore === 'happy') {
    return 1
  }
  if (joinScore === 'unhappy') {
    return 0
  }
  return Number(joinScore)
}

const removeZero = (data: RawData) => data.value > 0

const transformToData = (survey: SurveyParticipationDtoType) => ({
  date: new Date(survey.completionDate).getTime(),
  value: getScore(survey.score),
})
const getData = (state: any, surveyId: string | number) =>
  pipe(
    pathOr([], ['survey', 'surveyParticipationsByPatient']),
    filter<SurveyParticipationDtoType, 'array'>(filterBySurveyId(surveyId)),
    map<SurveyParticipationDtoType, RawData>(transformToData),
    filter<RawData, 'array'>(removeZero),
    sortWith([ascend(prop('date'))]),
  )(state)

interface GraphicPayload extends Action {
  payload: { surveyId: number | string; patientUuid: string }
}
function* fetchGraphic({ payload: { surveyId, patientUuid } }: GraphicPayload) {
  try {
    if (surveyId && patientUuid) {
      yield asyncAction(
        surveyActions.getSurveyParticipationsByPatientRequested(patientUuid),
      )
      const data = yield select(getData, surveyId)
      yield put(Actions.graphicSucceeded(data))
      yield put(NavAction.push('graphic'))
    } else {
      yield put(Actions.graphicFailed(new Error('id or currentUser undefined')))
    }
  } catch (err) {
    yield put(Actions.graphicFailed(err))
  }
}

export default [takeEvery(ActionTypes.GRAPHIC_REQUESTED, fetchGraphic)]
