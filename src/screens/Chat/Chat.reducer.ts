import { ActionTypes } from 'screens/Chat/Chat.actions'

const {
  ADD_PHOTO_REQUESTED,
  ADD_PHOTO_SUCCEEDED,
  ADD_PHOTO_FAILED,
  ADD_PHOTO_CANCELLED,
} = ActionTypes

interface User {
  _id: string
  avatar?: string
  name?: string
}

interface MessageType {
  _id: string
  text: string
  createdAt: Date
  user: User
  sequenceNo: number
}

interface MessagesStateType {
  refreshing: boolean
  conversations: {
    [key: string]: MessageType[]
  }
  error?: string
  cachedAttachments: {
    [key: string]: Date
  }
}

const initialState = {
  refreshing: false,
  conversations: {},
  sendMessageFailed: false,
  error: undefined,
  cachedAttachments: {},
}

export default function chat(
  state: MessagesStateType = initialState,
  action: any,
) {
  switch (action.type) {
    case ADD_PHOTO_REQUESTED: {
      return {
        ...state,
        refreshing: true,
        error: undefined,
      }
    }

    case ADD_PHOTO_SUCCEEDED: {
      return {
        ...state,
        refreshing: false,
        error: undefined,
      }
    }

    case ADD_PHOTO_FAILED: {
      return {
        ...state,
        refreshing: false,
        error: action.message,
      }
    }

    case ADD_PHOTO_CANCELLED: {
      return {
        ...state,
        refreshing: false,
        error: undefined,
      }
    }

    default:
      return state
  }
}
