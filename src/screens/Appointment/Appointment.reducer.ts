import { ActionTypes } from './Appointment.actions'

const { APPOINTMENT_REQUESTED, APPOINTMENT_SUCCEEDED } = ActionTypes

interface State {
  error?: Error
  data?: any
  id?: number
}

type Action = {
  type: keyof typeof ActionTypes
  payload: any
  id: number
}

const initialState: State = {
  error: undefined,
  data: undefined,
  id: undefined
}

export default function appointment(
  state: State = initialState,
  action: Action
) {
  switch (action.type) {
    case APPOINTMENT_REQUESTED: {
      const { id } = action
      return { ...state, error: undefined, id }
    }

    case APPOINTMENT_SUCCEEDED: {
      const { payload } = action
      return {
        ...state,
        error: undefined,
        data: payload
      }
    }

    default:
      return state
  }
}
