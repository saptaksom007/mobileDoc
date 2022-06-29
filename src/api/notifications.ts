import { pipe } from 'ramda'
import * as Sentry from 'sentry-expo'

import * as Notifications from 'expo-notifications'

import * as Permissions from 'expo-permissions'

import { runRequestAsync } from 'utilities/axios'
import { Env } from 'env'
import { then, catchP } from 'utilities/pointFreePromise'

import { getLimitedAccessTokenFromStoreAsync } from './auth'
import { throwApiError } from './error'
import { LIMITED_ACCESS_TOKEN_KEY } from 'config/auth'

const {
  api: { endpoints },
} = Env

// Register notifications mobile part
export const registerNotifications = async (apiToken: any) => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  )
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    Sentry.Native.captureMessage('notificaiton not granted')
    return Promise.resolve()
  }

  const pushToken = await Notifications.getExpoPushTokenAsync()

  return runRequestAsync({
    url: endpoints.registerPushNotification,
    method: 'POST',
    data: { token: pushToken.data },
    token: apiToken,
  })
}

// Register notifications, compose with access_token function
export const registerForPushNotificationsAsync = () =>
  pipe(
    getLimitedAccessTokenFromStoreAsync,
    then(registerNotifications),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)
