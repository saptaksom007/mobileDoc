export const ActionTypes = {
  APPOINTMENT_REQUESTED: 'APPOINTMENT_REQUESTED',
  APPOINTMENT_SUCCEEDED: 'APPOINTMENT_SUCCEEDED',
  APPOINTMENT_FAILED: 'APPOINTMENT_FAILED'
}

export default class Actions {
  static appointmentRequested(id: number) {
    return {
      type: ActionTypes.APPOINTMENT_REQUESTED,
      id
    }
  }
  static appointmentSucceeded(payload: any) {
    return {
      type: ActionTypes.APPOINTMENT_SUCCEEDED,
      payload
    }
  }
  static appointmentFailed(error: Error) {
    return {
      type: ActionTypes.APPOINTMENT_FAILED,
      payload: {
        error
      }
    }
  }
}
