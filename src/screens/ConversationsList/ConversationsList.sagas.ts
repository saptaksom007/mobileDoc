import {
  put,
  throttle,
  select,
  call,
  delay,
  takeLatest,
} from 'redux-saga/effects'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import pathOr from 'ramda/es/pathOr'
import i18n from 'ex-react-native-i18n'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import Actions, { ActionTypes } from './ConversationsList.actions'
import { Action } from 'redux'
import pipe from 'ramda/es/pipe'
import length from 'ramda/es/length'

const isLoggedIn = pathOr(false, ['login', 'isLoggedIn'])

const getRememberedGoToChatAction = pathOr(undefined, [
  'conversation',
  'rememberedGoToChatAction',
])

const getMessagesListLength = (conversationId: number) =>
  pipe(
    pathOr([], ['messaging', 'conversations', `${conversationId}`, 'messages']),
    length,
  )

function* effectiveGoToChat(conversationId: number, text?: string) {
  yield put(messagingActions.selectConversation(conversationId))
  yield put(NavAction.push('chat', { text }))
  yield delay(5000)
  const messagesListLength = yield select(getMessagesListLength(conversationId))
  if (messagesListLength === 1) {
    // force to load messages if it's not yet the case
    yield put(messagingActions.loadMessagesRequested(conversationId))
  }
}

function* gotoChatSelect(action: Action & { payload: any }) {
  try {
    const {
      payload: { conversationId, text },
    } = action

    const userLogged = yield select(isLoggedIn)
    if (userLogged) {
      yield call(effectiveGoToChat, Number(conversationId), text)
    } else {
      yield put(Actions.rememberGotoChat(action))
    }
    yield put(Actions.gotoChatSucceeded(Number(conversationId)))
  } catch (error) {
    yield put(Actions.gotoChatFailed(error))
    yield put(
      NavAction.showLocalError(
        i18n.t('conversationslist.errors.gotoChatSelect'),
      ),
    )
  }
}

function* execRememberedGotoChatSaga() {
  try {
    const rememberedGoToChatAction = yield select(getRememberedGoToChatAction)
    if (rememberedGoToChatAction) {
      yield call(gotoChatSelect, rememberedGoToChatAction)
      yield put(Actions.execRememberedGotoChatSucceeded())
    }
  } catch (error) {
    yield put(Actions.execRememberedGotoChatFailed(error))
  }
}

export default [
  throttle(1500, ActionTypes.GOTO_CHAT_REQUESTED, gotoChatSelect),
  takeLatest(
    ActionTypes.EXEC_REMEMBERED_GOTO_CHAT_REQUESTED,
    execRememberedGotoChatSaga,
  ),
]
