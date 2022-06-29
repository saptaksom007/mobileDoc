export const ActionTypes = {
  APPOINTMENT_CONFIRMATION_REQUESTED: 'APPOINTMENT_CONFIRMATION_REQUESTED',
  APPOINTMENT_CONFIRMATION_SUCCEEDED: 'APPOINTMENT_CONFIRMATION_SUCCEEDED',
  APPOINTMENT_CONFIRMATION_FAILED: 'APPOINTMENT_CONFIRMATION_FAILED',
  MARK_AS_READ_APPOINTMENT_CONFIRMATION: 'MARK_AS_READ_APPOINTMENT_CONFIRMATION'
}

export default class Actions {
  static appointmentConfirmationRequested(id: number) {
    return {
      type: ActionTypes.APPOINTMENT_CONFIRMATION_REQUESTED,
      payload: id
    }
  }
  static appointmentConfirmationSucceeded(data: any) {
    return {
      type: ActionTypes.APPOINTMENT_CONFIRMATION_SUCCEEDED,
      payload: data
    }
  }
  static appointmentConfirmationFailed(error: Error) {
    return {
      type: ActionTypes.APPOINTMENT_CONFIRMATION_FAILED,
      payload: error
    }
  }
  static markAsReadAppointmentConfirmation(id: number) {
    return {
      type: ActionTypes.MARK_AS_READ_APPOINTMENT_CONFIRMATION,
      payload: id
    }
  }
}
