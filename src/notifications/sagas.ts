import { Platform, AppState } from 'react-native'
import * as Notifications from 'expo-notifications'
import i18n from 'ex-react-native-i18n'
import { put, select, takeEvery, call } from 'redux-saga/effects'
import { v4 } from 'uuid'
import { path, pathOr } from 'ramda'
import { Actions as NavAction } from 'navigation/SagaNavigation'

import { messagingActionTypes } from 'common-docdok/lib/domain/messaging/actions'
import Actions, { ActionTypes } from './actions'

const selectNotifications = pathOr([], ['notifications', 'notificationsList'])
const getSelectedConversation = path(['dashboard', 'conversationId'])

const addNotification = function* addNotificationFn({ notification }: any) {
  try {
    yield put(
      Actions.addNotificationSucceeded({
        uuid: v4(),
        ...notification,
        addedAt: Date.now(),
      }),
    )
  } catch (err) {
    yield put(Actions.addNotificationFailed(err))
  }
}

const removeNotification = function* removeNotificationFn({
  notificationType,
}: any) {
  try {
    const allNotifs: any[] = yield select(selectNotifications)
    const conversationId: number = yield select(getSelectedConversation)
    if (conversationId) {
      const notifs = allNotifs.filter(
        (notif: any) => notif.data.conversation !== String(conversationId),
      )
      if (!notificationType) {
        yield put(Actions.removeNotificationSucceeded(notifs))
      } else {
        const filterOnTypeNotifs = notifs.filter(
          (notif: Notifications.Notification) =>
            notif.request.content.data.type !== notificationType,
        )
        yield put(Actions.removeNotificationSucceeded(filterOnTypeNotifs))
      }
    } else {
      const filterOnTypeNotifs = allNotifs.filter(
        (notif: Notifications.Notification) =>
          notif.request.content.data.type !== notificationType,
      )
      // Special case to clean notifications on android
      if (Platform.OS === 'android' && AppState.currentState === 'active') {
        yield call(Notifications.dismissAllNotificationsAsync)
      }
      yield put(Actions.removeNotificationSucceeded(filterOnTypeNotifs))
    }
  } catch (err) {
    yield put(Actions.removeNotificationFailed(err))
  }
}

const resetBadgeNumber = function* resetBadgeNumberFn() {
  try {
    yield call(Notifications.setBadgeCountAsync, 0)
  } catch (err) {
    NavAction.showLocalError(i18n.t('error.default'))
  }
}

export default [
  takeEvery(ActionTypes.ADD_NOTIFICATION_REQUESTED, addNotification),
  takeEvery(ActionTypes.REMOVE_NOTIFICATION_REQUESTED, removeNotification),
  takeEvery(messagingActionTypes.MARK_AS_CHECKED_SUCCEEDED, resetBadgeNumber),
]
