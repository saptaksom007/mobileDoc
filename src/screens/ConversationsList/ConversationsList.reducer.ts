import { ActionTypes } from './ConversationsList.actions'
import { Action as ReduxAction } from 'redux'

const {
  GOTO_CHAT_FAILED,
  GOTO_CHAT_SUCCEEDED,
  REMEMBER_GOTO_CHAT,
  EXEC_REMEMBERED_GOTO_CHAT_SUCCEEDED,
  EXEC_REMEMBERED_GOTO_CHAT_FAILED,
} = ActionTypes

interface State {
  error?: string
  conversationId?: number
  rememberedGoToChatAction?: ReduxAction & { payload: any }
}

interface Action {
  type: keyof typeof ActionTypes
  payload?: any
}

const initialState: State = {
  error: undefined,
  conversationId: undefined,
  rememberedGoToChatAction: undefined,
}

export default function conversationslist(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case GOTO_CHAT_FAILED: {
      const { payload } = action
      return { ...state, error: payload }
    }

    case GOTO_CHAT_SUCCEEDED: {
      const conversationId = action.payload
      return {
        ...state,
        conversationId: Number(conversationId),
      }
    }

    case REMEMBER_GOTO_CHAT:
      return { ...state, rememberedGoToChatAction: action.payload }

    case EXEC_REMEMBERED_GOTO_CHAT_SUCCEEDED:
    case EXEC_REMEMBERED_GOTO_CHAT_FAILED:
      return { ...state, rememberedGoToChatAction: undefined }

    default:
      return state
  }
}
