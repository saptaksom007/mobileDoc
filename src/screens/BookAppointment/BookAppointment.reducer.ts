import { ActionTypes } from './BookAppointment.actions'

const {
  INIT_BOOKING_APPOINTMENT,
  SELECT_BOOK_APPOINTMENT_OPTION,
  CHANGE_REASON_FOR_APPOINTMENT,
  CHANGE_OTHER_DOCTOR,
  NAVIGATE_TO_BOOKAPPOINTMENT
} = ActionTypes

const initialState = {
  error: undefined,
  preferredDate: 'anyDate',
  preferredDayOfWeek: 'anyDayOfWeek',
  preferredTimeOfDay: 'anyTime',
  preferredDoctor: 0,
  reasonForAppointment: undefined,
  otherDoctor: undefined,
  conversationId: undefined,
  clinicId: undefined
}

const cleanFreeTextSafe = (text: string) =>
  text && text.replace(':', ' ').replace('/n', ' ')

export default function bookappointment(
  state: typeof initialState = initialState,
  action: { type: keyof typeof ActionTypes; payload: any }
) {
  switch (action.type) {
    case INIT_BOOKING_APPOINTMENT: {
      const { conversationId, clinicId } = state
      return { ...initialState, conversationId, clinicId }
    }

    case SELECT_BOOK_APPOINTMENT_OPTION: {
      return { ...state, ...action.payload }
    }

    case CHANGE_REASON_FOR_APPOINTMENT: {
      const reasonForAppointment = cleanFreeTextSafe(action.payload)
      return { ...state, reasonForAppointment }
    }

    case CHANGE_OTHER_DOCTOR: {
      const otherDoctor = cleanFreeTextSafe(action.payload)
      return { ...state, otherDoctor }
    }

    case NAVIGATE_TO_BOOKAPPOINTMENT: {
      const { conversationId, clinicId } = action.payload
      return { ...state, conversationId, clinicId }
    }

    default:
      return state
  }
}
