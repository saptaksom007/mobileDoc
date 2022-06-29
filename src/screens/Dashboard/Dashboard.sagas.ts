import {
  call,
  put,
  select,
  takeLatest,
  delay,
  race,
  take,
} from 'redux-saga/effects'
import { pathOr, pipe, path, filter, last, propEq } from 'ramda'

import { Platform, Alert, Linking, AppState } from 'react-native'

import * as Notifications from 'expo-notifications'
import * as Updates from 'expo-updates'
import * as IntentLauncherAndroid from 'expo-intent-launcher'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import { isProduction, isStage, isQa } from 'utilities/environment'
import { clearStorageAsync } from 'utilities/localStorage'
import NotificationsActions, {
  ActionTypes as NotifActionTypes,
} from 'notifications/actions'

import { userActionTypes } from 'common-docdok/lib/domain/user/actions'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import { surveyActions } from 'common-docdok/lib/domain/survey/actions'
import { PersistStoreActions } from 'common-docdok/lib/configuration/persistStore'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { NavigationService } from 'navigation/NavigationService'
import i18n from 'ex-react-native-i18n'
import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'
import AppointmentsListActions from 'screens/AppointmentsList/AppointmentsList.actions'
import LoginActions, {
  ActionTypes as LoginActionTypes,
} from 'screens/Login/Login.actions'
import { getSurveyUrlById } from 'utilities/survey'
import { Env } from 'env'

import Actions, { ActionTypes } from './Dashboard.actions'
import { registerForPushNotificationsAsync } from 'api/notifications'
import {
  refreshingTokenAsync,
  persistExpireInAsync,
  getLimitedAccessTokenExpirationFromStoreAsync,
  logoutAsync,
} from 'api/auth'
import { Tokens } from '../../api/types'
import { fetchUserDetailsAsync } from 'api/user'

const getRefreshToken = pathOr('', ['login', 'refresh_token'])

const isLoggedInSelector = pathOr(false, ['login', 'isLoggedIn'])
const getRefreshTokenExpireIn = pathOr(0, ['login', 'refresh_expires_in'])

const getLatestNotificationFromSelected = pipe(
  // @ts-ignore
  path(['notifications', 'notificationsList']),
  filter((notif: { origin: string }) => notif.origin === 'selected'),
  last,
)
const getLatestNotificationFromInnerApp = pipe(
  // @ts-ignore
  path(['notifications', 'notificationsList']),
  filter((notif: any) => notif.origin !== 'selected'),
  last,
)

function* enableNotifications() {
  try {
    if (Constants.isDevice) {
      yield call(registerForPushNotificationsAsync)
    }
    yield put(Actions.enableNotificationsSucceeded())
  } catch (err) {
    yield put(Actions.enableNotificationsFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('dashboard.errors.enableNotifications')),
    )
  }
}

function* refreshToken({ newTokens }: any) {
  try {
    if (!newTokens) {
      // verify if user is logged in
      const isLoggedIn: boolean = yield select(isLoggedInSelector)
      if (isLoggedIn) {
        const refreshTokenExpireIn: number = yield select(
          getRefreshTokenExpireIn,
        )
        const now = Number(new Date().getTime())
        if (now >= refreshTokenExpireIn) {
          yield put(LoginActions.sessionHasExpired())
        } else {
          const refresh_token: string = yield select(getRefreshToken)
          const result: Tokens = yield call(refreshingTokenAsync, refresh_token)
          yield call(persistExpireInAsync, result.expires_in)
          yield put(Actions.refreshTokenSucceeded(result))
        }
      } else {
        yield put(Actions.refreshTokenCancelled())
      }
    } else {
      yield call(persistExpireInAsync, newTokens.expires_in)
      yield put(Actions.refreshTokenSucceeded(newTokens))
    }
  } catch (err) {
    yield put(
      NavAction.showLocalError(
        i18n.t('dashboard.errors.refreshToken'),
        'login',
      ),
    )
    yield delay(3000)
    yield call(Updates.reloadAsync)
  }
}

function* refreshDashboard() {
  try {
    if (AppState.currentState === 'active') {
      const refreshTokenExp: number = yield select(getRefreshTokenExpireIn)
      const isLoggedIn: boolean = yield select(isLoggedInSelector)
      const isLoggedInOrTokenOk: boolean =
        isLoggedIn || Date.now() < refreshTokenExp
      const routeName = NavigationService.getCurrentRoute()
      const limitedAccessTokenExp: number = yield call(
        getLimitedAccessTokenExpirationFromStoreAsync,
      )

      // test if connected before load subcriptions
      if (isLoggedInOrTokenOk) {
        if (routeName !== 'chat') {
          yield put(messagingActions.getSubscriptionsRequested())
        }
        yield put(surveyActions.getMySurveysRequested())
      }
      if (Date.now() < Number(limitedAccessTokenExp)) {
        yield put(AppointmentsListActions.appointmentsListRequested())
      }
    }
  } catch (error) {
    yield put(NavAction.showLocalError(i18n.t('errors.default'), 'login'))
  }
}

function* receivedNotification() {
  try {
    const routeName = NavigationService.getCurrentRoute()
    const isLoggedIn: boolean = yield select(isLoggedInSelector)

    yield refreshDashboard()

    const notif: Notifications.Notification = yield select(
      getLatestNotificationFromSelected,
    )

    if (isLoggedIn) {
      if (notif) {
        if (
          notif.request.content.data.notificationType === 'CHAT' ||
          notif.request.content.data.type === 'CHAT'
        ) {
          const conversationId = notif.request.content.data
            .conversation as number
          yield put(ConversationsListActions.gotoChatRequested(conversationId))
        } else if (notif.request.content.data.type === 'SURVEY') {
          const url = getSurveyUrlById(notif.request.content.data.id as number)
          yield put(NavAction.push('surveywebview', { url }))
        } else if (notif.request.content.data.type === 'APPOINTMENT') {
          const { appointmentId } = notif.request.content.data
          if (appointmentId) {
            switch (notif.request.content.data.appointmentType) {
              case 'Appointment':
                yield put(NavAction.push('appointment', { appointmentId }))
                break
              case 'Schedule':
                yield put(
                  NavAction.push('scheduleappointment', { appointmentId }),
                )
                break
              case 'Confirmation':
                yield put(
                  NavAction.push('appointmentconfirmation', { appointmentId }),
                )
                break

              default:
                yield put(
                  NavAction.showLocalNotice(
                    i18n.t('dashboard.notices.receivedNotificationAppointment'),
                  ),
                )
                break
            }
          }
        } else {
          NavAction.showLocalNotice(
            i18n.t('dashboard.notices.receivedNotification'),
          )
        }
      } else {
        const innerNotif: Notifications.Notification = yield select(
          getLatestNotificationFromInnerApp,
        )
        if (innerNotif && innerNotif.request) {
          if (
            innerNotif.request.content.data.notificationType === 'CHAT' ||
            innerNotif.request.content.data.type === 'CHAT'
          ) {
            if (routeName !== 'chat') {
              yield put(
                NavAction.showLocalNotice(
                  i18n.t('dashboard.notices.receivedNotificationChat'),
                  'chat',
                ),
              )
            }
          } else if (innerNotif.request.content.data.type === 'SURVEY') {
            const isReminder: boolean = propEq(
              'subtype',
              'SURVEY_REMINDER',
              innerNotif.request.content.data,
            )
            if (isReminder) {
              yield put(
                NavAction.showLocalNotice(
                  i18n.t(
                    'dashboard.notices.receivedNotificationSurveyReminder',
                  ),
                ),
              )
            } else {
              yield put(
                NavAction.showLocalNotice(
                  i18n.t('dashboard.notices.receivedNotificationSurvey'),
                ),
              )
            }
          } else if (innerNotif.request.content.data.type === 'APPOINTMENT') {
            yield put(
              NavAction.showLocalNotice(
                i18n.t('dashboard.notices.receivedNotificationAppointment'),
              ),
            )
          } else {
            NavAction.showLocalNotice(
              i18n.t('dashboard.notices.receivedNotification'),
            )
          }
        }
      }
    } else {
      if (notif) {
        if (
          notif.request.content.data.notificationType === 'CHAT' ||
          notif.request.content.data.type === 'CHAT'
        ) {
          const conversationId = notif.request.content.data
            .conversation as number
          yield put(ConversationsListActions.gotoChatRequested(conversationId))
        } else if (notif.request.content.data.type === 'SURVEY') {
          const url = getSurveyUrlById(notif.request.content.data.id as number)
          yield race({
            signin: take('LOGIN_SUCCEEDED'),
            timeout: delay(5000),
          })
          yield put(NavAction.push('surveywebview', { url, goBack: true }))
        }
      } else {
        NavAction.showLocalNotice(
          i18n.t('dashboard.notices.receivedNotification'),
        )
      }
    }
  } catch (err) {
    yield put(NotificationsActions.addNotificationFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('dashboard.errors.receivedNotification')),
    )
  } finally {
    yield put(NotificationsActions.removeNotificationRequested())
  }
}

function* appStateChange() {
  try {
    const refresh_token_expire_in: number = yield select(
      getRefreshTokenExpireIn,
    )
    const isLogged: boolean = yield select(isLoggedInSelector)

    if (AppState.currentState === 'active') {
      // Special case to clean notifications on android
      if (Platform.OS === 'android') {
        yield call(Notifications.dismissAllNotificationsAsync)
      }

      // session has expired action
      const now = Number(new Date().getTime())

      if (isLogged && now >= refresh_token_expire_in) {
        yield put(LoginActions.sessionHasExpired())
      }
    }
  } catch (err) {
    yield put({ type: 'APP_STATE_CHANGE_FAILED', payload: err })
  }
}

const shouldClearStorage = () =>
  new Promise((resolve: any) =>
    Alert.alert(
      i18n.t('tech.clearStorage.title'),
      i18n.t('tech.clearStorage.text'),
      [
        {
          text: i18n.t('global.yes'),
          onPress: () => resolve(true),
        },
        {
          text: i18n.t('global.no'),
          onPress: () => resolve(false),
        },
      ],
    ),
  )

function* logOut(action: any) {
  try {
    // stop persist here
    yield put(Actions.hideTerms())
    yield put(PersistStoreActions.stopPersistStore())
    const refresh_token: string = yield select(getRefreshToken)
    yield call(logoutAsync, refresh_token)

    if (isQa(Env.environment)) {
      const clearStorage: boolean = yield call(shouldClearStorage)
      if (clearStorage) {
        yield call(clearStorageAsync)
        yield put({ type: 'CLEAR_STORE' })
      }
    }
    if (action.payload && action.payload.clearStorage) {
      yield call(clearStorageAsync)
    }
    yield put(Actions.logOutSucceeded())
    yield put(NavAction.navigate('AuthLoading'))
  } catch (err) {
    yield put(Actions.logOutFailed(err))
    yield put(NavAction.showLocalError(i18n.t('dashboard.errors.logOut')))
  }
}

const gotoLockedDashboard = function* gotoLockedDashboardFn() {
  try {
    yield put(NavAction.immediatelyResetStack(['Appointment']))
    yield put(Actions.gotoLockedDashboardSucceeded())
  } catch (error) {
    yield put(Actions.gotoLockedDashboardFailed(error))
    yield put(
      NavAction.showLocalError(i18n.t('dashboard.errors.gotoLockedDashboard')),
    )
  }
}

const loginWithNextRoute = function* loginWithNextRouteFn() {
  try {
    yield put(NavAction.navigate('login'))
    yield put(Actions.loginWithNextRouteSucceeded())
  } catch (error) {
    yield put(Actions.loginWithNextRouteFailed(error))
  }
}

const showLocalError = function* showLocalErrorFn() {
  yield put(NavAction.showLocalError(i18n.t('error.default')))
}

const alertNotification = () =>
  new Promise((resolve: any) =>
    Alert.alert(
      i18n.t('alert.notification.title'),
      i18n.t('alert.notification.text'),
      [
        {
          text: i18n.t('global.yes'),
          onPress: () => resolve(true),
        },
        {
          text: i18n.t('global.no'),
          onPress: () => resolve(false),
        },
      ],
    ),
  )

function* verifyNotification({ currentAppState }: any) {
  try {
    if (currentAppState === 'active' && Constants.isDevice) {
      yield delay(5000) // wait 5s until user click on allowed app or not

      const isLoggedIn: boolean = yield select(isLoggedInSelector)
      const { status } = yield call(
        Permissions.getAsync,
        Permissions.NOTIFICATIONS,
      )

      if (status !== 'granted' && isLoggedIn) {
        yield put(Actions.showVerifyNotificationRequested())
        const displayConfigurationPanel: boolean = yield call(alertNotification)
        yield put(Actions.hideVerifyNotificationRequested())
        if (displayConfigurationPanel) {
          if (Platform.OS === 'android') {
            if (Platform.Version <= 23) {
              yield call(
                IntentLauncherAndroid.startActivityAsync,
                IntentLauncherAndroid.ACTION_NOTIFICATION_SETTINGS,
              )
            } else {
              yield call(
                IntentLauncherAndroid.startActivityAsync,
                IntentLauncherAndroid.ACTION_APP_NOTIFICATION_SETTINGS,
                {
                  packageName:
                    isProduction() || isStage()
                      ? 'ch.health.docdok'
                      : 'host.exp.exponent',
                },
              )
            }
          } else {
            yield call(Linking.openURL, 'app-settings://')
          }
        }
      }
    }
  } catch (err) {
    yield put(Actions.enableNotificationsFailed(err))
    yield put(
      NavAction.showLocalError(i18n.t('dashboard.errors.enableNotifications')),
    )
  }
}

function* connectivityChange({ payload: { isConnected } }: any) {
  if (!isConnected) {
    yield put(NavAction.showLocalError(i18n.t('error.internetConnectionLost')))
  }
}

function* newAppVersion() {
  try {
    if (!__DEV__) {
      const update: Updates.UpdateCheckResult = yield call(
        Updates.checkForUpdateAsync,
      )
      if (update.isAvailable) {
        const { isNew } = yield call(Updates.fetchUpdateAsync)
        if (isNew) {
          yield put(NavAction.showLocalNotice(i18n.t('global.update')))
          yield put(
            Actions.newAppVersionSucceeded('New app version will be installed'),
          )
          yield delay(3500)
          yield call(Updates.reloadAsync)
        }
        yield put(
          Actions.newAppVersionSucceeded("New app version isn't available"),
        )
      }
    } else {
      yield put(
        Actions.newAppVersionSucceeded(
          "checkForUpdateAsync isn't launch in dev mode",
        ),
      )
    }
  } catch (error) {
    yield put(Actions.newAppVersionFailed(error))
  }
}

function* verifyNewVersion({ currentAppState }: any) {
  try {
    if (currentAppState === 'active') {
      yield put(Actions.newAppVersionRequested())
    }
  } catch (error) {
    yield put(Actions.newAppVersionFailed(error))
  }
}

function* resetStackToDashboard() {
  const currentRoute = NavigationService.getCurrentRoute()
  const hasLimitedAccessTokenError = select(
    pathOr(false, ['login', 'isLimitedAccessTokenError']),
  )
  if (currentRoute !== 'profile' && !hasLimitedAccessTokenError) {
    yield put(NavAction.immediatelyResetStack(['dashboard']))
  }
}

function* cleanStart() {
  yield call(clearStorageAsync)
  yield put({ type: 'CLEAR_STORE' })
  yield delay(1500)
  yield call(Updates.reloadAsync)
}

function* loggedInUserDetails() {
  try {
    const details = yield call(fetchUserDetailsAsync)
    yield put(Actions.loggedInUserDetailsSucceeded(details))
  } catch (err) {
    yield put(Actions.loggedInUserDetailsFailed(err))
  }
}

export default [
  takeLatest(
    [
      ActionTypes.ENABLE_NOTIFICATION_REQUESTED,
      LoginActionTypes.GET_LIMITED_ACCESS_TOKEN_SUCCEEDED,
    ],
    enableNotifications,
  ),
  takeLatest(ActionTypes.REFRESH_TOKEN_REQUESTED, refreshToken),
  takeLatest(ActionTypes.LOGOUT_REQUESTED, logOut),
  takeLatest(NotifActionTypes.ADD_NOTIFICATION_SUCCEEDED, receivedNotification),
  takeLatest(ActionTypes.APP_STATE_CHANGE, appStateChange),
  takeLatest(ActionTypes.CONNECTIVITY_CHANGE, connectivityChange),
  takeLatest(ActionTypes.GOTO_LOCKED_DASHBOARD_REQUESTED, gotoLockedDashboard),
  takeLatest(ActionTypes.LOGIN_WITH_NEXT_ROUTE_REQUESTED, loginWithNextRoute),
  takeLatest(ActionTypes.APP_STATE_CHANGE, verifyNotification),
  takeLatest(
    [ActionTypes.APP_STATE_CHANGE, ActionTypes.REFRESH_DASHBOARD],
    refreshDashboard,
  ),
  takeLatest(ActionTypes.APP_STATE_CHANGE, verifyNewVersion),
  takeLatest(ActionTypes.NEW_APP_VERSION_REQUESTED, newAppVersion),
  takeLatest('PROFILE_FETCH_FAILED', cleanStart),
  takeLatest(
    [
      userActionTypes.TERMS_VERSION_EQUALS,
      userActionTypes.UPDATE_TERMS_VERSION_SUCCEEDED,
    ],
    resetStackToDashboard,
  ),
  takeLatest('CATCH_ERROR', showLocalError),
  takeLatest(
    ActionTypes.GET_LOGGED_IN_USER_DETAILS_REQUESTED,
    loggedInUserDetails,
  ),
]
