

export const ActionTypes = {
  SCHEDULE_APPOINTMENT: 'SCHEDULE_APPOINTMENT'
}

export default class Actions {
  static scheduleAppointment(scheduleAppointment: number) {
    return {
      type: ActionTypes.SCHEDULE_APPOINTMENT,
      payload: { scheduleAppointment }
    }
  }
}
