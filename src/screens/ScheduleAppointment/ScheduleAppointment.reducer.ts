import { ActionTypes } from './ScheduleAppointment.actions'

const { SCHEDULE_APPOINTMENT } = ActionTypes

interface State {
  cacheAppointments: number[]
}

type Action = {
  type: keyof typeof ActionTypes
  payload: {
    scheduleAppointment: number
  }
}

const initialState: State = {
  cacheAppointments: [],
}

export default function scheduleappointment(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case SCHEDULE_APPOINTMENT: {
      const cacheAppointments = state.cacheAppointments
      cacheAppointments.push(action.payload.scheduleAppointment)
      return {
        ...state,
        cacheAppointments: Array.from(new Set(cacheAppointments)),
      }
    }

    default:
      return state
  }
}
