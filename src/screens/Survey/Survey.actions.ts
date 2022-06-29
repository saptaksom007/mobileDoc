export const ActionTypes = {
  SELECT_SURVEY_REQUESTED: 'SELECT_SURVEY_REQUESTED',
  SELECT_SURVEY_SUCCEEDED: 'SELECT_SURVEY_SUCCEEDED',
  SELECT_SURVEY_FAILED: 'SELECT_SURVEY_FAILED'
}

export default class Actions {
  static selectSurveyRequested(url: string, patientId: string) {
    return {
      type: ActionTypes.SELECT_SURVEY_REQUESTED,
      payload: {
        url,
        patientId
      }
    }
  }
  static selectSurveySucceeded() {
    return { type: ActionTypes.SELECT_SURVEY_SUCCEEDED }
  }
  static selectSurveyFailed(error: Error) {
    return {
      type: ActionTypes.SELECT_SURVEY_FAILED,
      message: error.message,
      error
    }
  }
}
