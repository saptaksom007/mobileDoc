export const ActionTypes = {
  NAVIGATE_TO_CALENDER_EVENTS_LIST: 'NAVIGATE_TO_CALENDER_EVENTS_LIST',
  NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST:
    'NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST',
  ADD_CALENDAR_EVENT_REQUESTED: 'ADD_CALENDAR_EVENT_REQUESTED',
  ADD_CALENDAR_EVENT_SUCCEEDED: 'ADD_CALENDAR_EVENT_SUCCEEDED',
  ADD_CALENDAR_EVENT_FAILED: 'ADD_CALENDAR_EVENT_FAILED',
  GET_CALENDAR_EVENT_REQUESTED: 'GET_CALENDAR_EVENT_REQUESTED',
  GET_CALENDAR_EVENT_SUCCEEDED: 'GET_CALENDAR_EVENT_SUCCEEDED',
  GET_CALENDAR_EVENT_FAILED: 'GET_CALENDAR_EVENT_FAILED',
  ADD_ATTACHMENT_REQUESTED: 'ADD_ATTACHMENT_REQUESTED',
  ADD_ATTACHMENT_SUCCEEDED: 'ADD_ATTACHMENT_SUCCEEDED',
  ADD_ATTACHMENT_FAILED: 'ADD_ATTACHMENT_FAILED',
  ADD_ATTACHMENT_CANCELLED: 'ADD_ATTACHMENT_CANCELLED',
  NAVIGATE_TO_CALENDER_EVENTS_ADD: 'NAVIGATE_TO_CALENDER_EVENTS_ADD',
  DELETE_CALENDAR_EVENT_REQUESTED: 'DELETE_CALENDAR_EVENT_REQUESTED',
  DELETE_CALENDAR_EVENT_SUCCEEDED: 'DELETE_CALENDAR_EVENT_SUCCEEDED',
  DELETE_CALENDAR_EVENT_FAILED: 'DELETE_CALENDAR_EVENT_FAILED',
  GET_CALENDAR_EVENT_ATTACHMENT: 'GET_CALENDAR_EVENT_ATTACHMENT',
  SET_CALENDAR_EVENT_ATTACHMENT: 'SET_CALENDAR_EVENT_ATTACHMENT',
}

export default class Actions {
  static navigateToCalendarEventLoadList(type: string) {
    return {
      type: ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST,
      payload: {
        type,
      },
    }
  }

  static navigateToCalendarEventAdd(type: string, data = {}) {
    return {
      type: ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_ADD,
      payload: {
        type,
        data,
      },
    }
  }

  static navigateToCalendarEventList(
    canGoToAppointmentReq: boolean,
    conversationId: number,
    clinicId: number,
    scheduleAppointment?: number,
    futureAppointmentsCount?: number,
  ) {
    return {
      type: ActionTypes.NAVIGATE_TO_CALENDER_EVENTS_LIST,
      payload: {
        canGoToAppointmentReq,
        conversationId,
        clinicId,
        scheduleAppointment,
        futureAppointmentsCount,
      },
    }
  }

  static addCalendarEventRequested(payload: any) {
    return { type: ActionTypes.ADD_CALENDAR_EVENT_REQUESTED, payload }
  }
  static addCalendarEventSucceeded(event: any) {
    return { type: ActionTypes.ADD_CALENDAR_EVENT_SUCCEEDED, event }
  }
  static addCalendarEventFailed(error: Error) {
    return {
      type: ActionTypes.ADD_CALENDAR_EVENT_FAILED,
      payload: { error },
    }
  }

  static getCalendarEventRequested(payload: any) {
    return { type: ActionTypes.GET_CALENDAR_EVENT_REQUESTED, payload }
  }
  static getCalendarEventSucceeded(events: any) {
    return { type: ActionTypes.GET_CALENDAR_EVENT_SUCCEEDED, payload: events }
  }
  static getCalendarEventFailed(error: Error) {
    return {
      type: ActionTypes.GET_CALENDAR_EVENT_FAILED,
      payload: { error },
    }
  }

  static addAttachmentRequested(payload: any) {
    return { type: ActionTypes.ADD_ATTACHMENT_REQUESTED, payload }
  }

  static addAttachmentCancelled() {
    return { type: ActionTypes.ADD_ATTACHMENT_CANCELLED }
  }

  static addAttachmentSucceed() {
    return { type: ActionTypes.ADD_ATTACHMENT_SUCCEEDED }
  }

  static addAttachmentFailed() {
    return { type: ActionTypes.ADD_ATTACHMENT_FAILED }
  }

  static deleteCalendarEventRequested(payload: any) {
    return { type: ActionTypes.DELETE_CALENDAR_EVENT_REQUESTED, payload }
  }
  static deleteCalendarEventSucceeded() {
    return { type: ActionTypes.DELETE_CALENDAR_EVENT_SUCCEEDED }
  }
  static deleteCalendarEventFailed(error: Error) {
    return {
      type: ActionTypes.DELETE_CALENDAR_EVENT_FAILED,
      payload: { error },
    }
  }
  static getCalendarEventAttachment(payload: any) {
    return { type: ActionTypes.GET_CALENDAR_EVENT_ATTACHMENT, payload }
  }
  static setCalendarEventAttachment(payload: any) {
    return { type: ActionTypes.SET_CALENDAR_EVENT_ATTACHMENT, payload }
  }
}
