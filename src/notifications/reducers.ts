import { ActionTypes } from './actions'

const {
  ADD_NOTIFICATION_REQUESTED,
  ADD_NOTIFICATION_SUCCEEDED,
  ADD_NOTIFICATION_FAILED,
  REMOVE_NOTIFICATION_SUCCEEDED
} = ActionTypes

const initialState = {
  notificationsList: [],
  error: undefined
}

export default function notifications(
  state = initialState,
  action: {
    type: keyof typeof ActionTypes
    notification: any
    message: any
    notificationsList: any[]
  }
) {
  switch (action.type) {
    case ADD_NOTIFICATION_REQUESTED: {
      return { ...state, error: undefined }
    }

    case ADD_NOTIFICATION_SUCCEEDED: {
      return {
        ...state,
        error: undefined,
        notificationsList: [...state.notificationsList, action.notification]
      }
    }

    case ADD_NOTIFICATION_FAILED: {
      return { ...state, error: action.message }
    }

    case REMOVE_NOTIFICATION_SUCCEEDED: {
      return {
        ...state,
        error: undefined,
        notificationsList: action.notificationsList
      }
    }

    default:
      return state
  }
}
