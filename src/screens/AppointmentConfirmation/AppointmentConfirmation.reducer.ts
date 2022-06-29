import { ActionTypes } from './AppointmentConfirmation.actions'

const {
  APPOINTMENT_CONFIRMATION_REQUESTED,
  APPOINTMENT_CONFIRMATION_SUCCEEDED,
  APPOINTMENT_CONFIRMATION_FAILED,
} = ActionTypes

interface State {
  loading?: boolean
}

type Action = {
  type: keyof typeof ActionTypes
  payload: {}
}

const initialState: State = {}

export default function appointmentconfirmation(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case APPOINTMENT_CONFIRMATION_REQUESTED: {
      return { ...state }
    }

    case APPOINTMENT_CONFIRMATION_SUCCEEDED: {
      return { ...state, ...action.payload }
    }

    case APPOINTMENT_CONFIRMATION_FAILED: {
      return { ...state }
    }

    default:
      return state
  }
}
