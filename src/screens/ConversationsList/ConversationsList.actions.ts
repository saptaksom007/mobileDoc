import { Action } from 'redux'

export const ActionTypes = {
  GOTO_CHAT_REQUESTED: 'GOTO_CHAT_REQUESTED',
  GOTO_CHAT_SUCCEEDED: 'GOTO_CHAT_SUCCEEDED',
  GOTO_CHAT_FAILED: 'GOTO_CHAT_FAILED',
  REMEMBER_GOTO_CHAT: 'REMEMBER_GOTO_CHAT',
  EXEC_REMEMBERED_GOTO_CHAT_REQUESTED: 'EXEC_REMEMBERED_GOTO_CHAT_REQUESTED',
  EXEC_REMEMBERED_GOTO_CHAT_SUCCEEDED: 'EXEC_REMEMBERED_GOTO_CHAT_SUCCEEDED',
  EXEC_REMEMBERED_GOTO_CHAT_FAILED: 'EXEC_REMEMBERED_GOTO_CHAT_FAILED',
}

export default class Actions {
  static gotoChatRequested(conversationId: number, text?: string) {
    return {
      type: ActionTypes.GOTO_CHAT_REQUESTED,
      payload: {
        conversationId,
        text,
      },
    }
  }
  static gotoChatSucceeded(conversationId: number) {
    return { type: ActionTypes.GOTO_CHAT_SUCCEEDED, payload: conversationId }
  }
  static gotoChatFailed(error: Error) {
    return {
      type: ActionTypes.GOTO_CHAT_FAILED,
      payload: error,
    }
  }

  static rememberGotoChat(action: Action) {
    return {
      type: ActionTypes.REMEMBER_GOTO_CHAT,
      payload: action,
    }
  }

  static execRememberedGotoChatRequested() {
    return {
      type: ActionTypes.EXEC_REMEMBERED_GOTO_CHAT_REQUESTED,
      payload: undefined,
    }
  }
  static execRememberedGotoChatSucceeded() {
    return {
      type: ActionTypes.EXEC_REMEMBERED_GOTO_CHAT_SUCCEEDED,
      payload: undefined,
    }
  }
  static execRememberedGotoChatFailed(error: Error) {
    return {
      type: ActionTypes.EXEC_REMEMBERED_GOTO_CHAT_FAILED,
      payload: error,
    }
  }
}
