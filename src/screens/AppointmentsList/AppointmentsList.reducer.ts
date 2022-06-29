import { uniq } from 'ramda'
import { ActionTypes } from './AppointmentsList.actions'
import { ActionTypes as AppointmentsConfirmationActionTypes } from '../AppointmentConfirmation/AppointmentConfirmation.actions'

const {
  APPOINTMENTSLIST_REQUESTED,
  APPOINTMENTSLIST_SUCCEEDED,
  APPOINTMENTSLIST_FAILED,
  APPOINTMENTSLIST_LOADED,
} = ActionTypes

interface State {
  error?: Error
  rawList: object[]
  loaded: boolean
  markAsRead: number[]
}

interface Action {
  type: keyof typeof ActionTypes
  payload: {
    error?: Error
    rawList?: object[]
    reloadNavigation?: boolean
  }
}

const initialState: State = {
  error: undefined,
  rawList: [],
  loaded: false,
  markAsRead: [],
}

export default function appointmentslist(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case APPOINTMENTSLIST_REQUESTED: {
      return {
        ...state,
        error: undefined,
      }
    }

    case APPOINTMENTSLIST_SUCCEEDED: {
      const { rawList } = action.payload
      return {
        ...state,
        error: undefined,
        rawList,
        loaded: true,
      }
    }

    case APPOINTMENTSLIST_FAILED: {
      return {
        ...state,
        error: action.payload.error,
        rawList: [],
        loaded: true,
      }
    }

    case APPOINTMENTSLIST_LOADED: {
      return {
        ...state,
        loaded: true,
      }
    }

    // tslint:disable-next-line:max-line-length
    case AppointmentsConfirmationActionTypes.MARK_AS_READ_APPOINTMENT_CONFIRMATION: {
      const readAppointment = {
        ...state.rawList.find((app: any) => app.id === action.payload),
        markAsRead: true,
      }
      return {
        ...state,
        rawList: [
          ...state.rawList.filter((app: any) => app.id !== action.payload),
          readAppointment,
        ],
        markAsRead: uniq([...state.markAsRead, action.payload]),
      }
    }

    default:
      return state
  }
}
