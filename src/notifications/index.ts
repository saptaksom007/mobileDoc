import * as Notifications from 'expo-notifications'
import { APIContext } from 'api'
import Actions from './actions'

export function handleNotification(
  notification: Notifications.Notification,
  origin: 'selected' | 'received' = 'received',
) {
  if (APIContext.store) {
    APIContext.store.dispatch(
      Actions.addNotificationRequested({ ...notification, origin }),
    )
  } else {
    // To be sure the notification is handle even if the store is not yet here
    setTimeout(() => handleNotification(notification), 2000)
  }
}

export function subscribe() {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    handleNotification,
  )
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (notif: Notifications.NotificationResponse) =>
      handleNotification(notif.notification, 'selected'),
  )

  return {
    remove() {
      receivedSubscription.remove()
      responseSub.remove()
    },
  }
}

export function unsubscribe(listener: any) {
  if (listener) {
    listener.remove()
  }
}
