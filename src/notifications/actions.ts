export const ActionTypes = {
  ADD_NOTIFICATION_REQUESTED: 'ADD_NOTIFICATION_REQUESTED',
  ADD_NOTIFICATION_SUCCEEDED: 'ADD_NOTIFICATION_SUCCEEDED',
  ADD_NOTIFICATION_FAILED: 'ADD_NOTIFICATION_FAILED',
  REMOVE_NOTIFICATION_REQUESTED: 'REMOVE_NOTIFICATION_REQUESTED',
  REMOVE_NOTIFICATION_SUCCEEDED: 'REMOVE_NOTIFICATION_SUCCEEDED',
  REMOVE_NOTIFICATION_FAILED: 'REMOVE_NOTIFICATION_FAILED'
}

export default class Actions {
  static addNotificationRequested(notification: any) {
    return { type: ActionTypes.ADD_NOTIFICATION_REQUESTED, notification }
  }
  static addNotificationSucceeded(notification: any) {
    return { type: ActionTypes.ADD_NOTIFICATION_SUCCEEDED, notification }
  }
  static addNotificationFailed(error: Error) {
    return {
      type: ActionTypes.ADD_NOTIFICATION_FAILED,
      payload: { error }
    }
  }
  static removeNotificationRequested(notificationType?: string) {
    return { type: ActionTypes.REMOVE_NOTIFICATION_REQUESTED, notificationType }
  }
  static removeNotificationSucceeded(notificationsList: any[]) {
    return {
      type: ActionTypes.REMOVE_NOTIFICATION_SUCCEEDED,
      notificationsList
    }
  }
  static removeNotificationFailed(error: Error) {
    return {
      type: ActionTypes.REMOVE_NOTIFICATION_FAILED,
      payload: { error }
    }
  }
}
