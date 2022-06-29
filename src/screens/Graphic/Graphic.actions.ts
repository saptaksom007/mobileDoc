export const ActionTypes = {
  GRAPHIC_REQUESTED: 'GRAPHIC_REQUESTED',
  GRAPHIC_SUCCEEDED: 'GRAPHIC_SUCCEEDED',
  GRAPHIC_FAILED: 'GRAPHIC_FAILED',
}

export default class Actions {
  static graphicRequested(surveyId: number, patientUuid: string) {
    return {
      type: ActionTypes.GRAPHIC_REQUESTED,
      payload: { surveyId, patientUuid },
    }
  }
  static graphicSucceeded(data: any[]) {
    return {
      type: ActionTypes.GRAPHIC_SUCCEEDED,
      payload: data,
    }
  }
  static graphicFailed(error: Error) {
    return {
      type: ActionTypes.GRAPHIC_FAILED,
      payload: {
        error,
      },
    }
  }
}
