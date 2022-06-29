import { OptionType } from './BookAppointment.types'

export const ActionTypes = {
  INIT_BOOKING_APPOINTMENT: 'INIT_BOOKING_APPOINTMENT',
  SELECT_BOOK_APPOINTMENT_OPTION: 'SELECT_BOOK_APPOINTMENT_OPTION',
  NAVIGATE_TO_CHAT: 'NAVIGATE_TO_CHAT',
  NAVIGATE_TO_BOOKAPPOINTMENT: 'NAVIGATE_TO_BOOKAPPOINTMENT',
  CHANGE_REASON_FOR_APPOINTMENT: 'CHANGE_REASON_FOR_APPOINTMENT',
  CHANGE_OTHER_DOCTOR: 'CHANGE_OTHER_DOCTOR',
}

export default class Actions {
  static initBookingAppointment() {
    return {
      type: ActionTypes.INIT_BOOKING_APPOINTMENT,
      payload: undefined,
    }
  }

  static selectOption(option: { [key: string]: OptionType }) {
    return {
      type: ActionTypes.SELECT_BOOK_APPOINTMENT_OPTION,
      payload: option,
    }
  }

  static navigateToChat(doctorId: string, conversationId: number) {
    return {
      type: ActionTypes.NAVIGATE_TO_CHAT,
      payload: { doctorId, conversationId },
    }
  }

  static navigateToBookAppointment(
    conversationId: number,
    clinicId: number,
    scheduleAppointment?: number,
    futureAppointmentsCount?: number,
  ) {
    return {
      type: ActionTypes.NAVIGATE_TO_BOOKAPPOINTMENT,
      payload: {
        conversationId,
        clinicId,
        scheduleAppointment,
        futureAppointmentsCount,
      },
    }
  }

  static changeReasonForAppointment(text: string) {
    return {
      type: ActionTypes.CHANGE_REASON_FOR_APPOINTMENT,
      payload: text,
    }
  }

  static changeOtherDoctor(text: string) {
    return {
      type: ActionTypes.CHANGE_OTHER_DOCTOR,
      payload: text,
    }
  }
}
