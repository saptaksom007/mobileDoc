import { call, put, takeEvery, select, all, delay } from 'redux-saga/effects'
import { pathOr, pipe, path, map, prop } from 'ramda'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import i18n from 'ex-react-native-i18n'
import * as Sentry from 'sentry-expo'
import * as Updates from 'expo-updates'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import {
  healthrelationActions,
  healthrelationActionTypes,
} from 'common-docdok/lib/domain/healthrelation/actions'
import {
  userActions,
  userActionTypes,
} from 'common-docdok/lib/domain/user/actions'
import { surveyActions } from 'common-docdok/lib/domain/survey/actions'
import { PersistStoreActions } from 'common-docdok/lib/configuration/persistStore'
import { asyncAction } from 'common-docdok/lib/utils/sagaUtils'
import { KeycloakInfo } from 'utilities/keycloak'
import Actions, { ActionTypes } from './Login.actions'
import DashboardActionsfrom from 'screens/Dashboard/Dashboard.actions'
import AppointmentsListActions from 'screens/AppointmentsList/AppointmentsList.actions'
import { LIMITED_ACCESS_TOKEN_KEY, TOKEN_KEY } from 'config/auth'
import {
  deleteStorageItem,
  setStorageItemEncrypted,
} from 'utilities/localStorage'
import {
  retrieveTokensAsync,
  persistExpireInAsync,
  getLimitedAccessTokenFromStoreAsync,
  getLimitedAccessTokenExpirationFromStoreAsync,
  getLimitedAccessTokenAsync,
} from 'api/auth'
import { Action } from 'redux'

const isLoggedInSelector = pathOr(false, ['login', 'isLoggedIn'])
const getNextRoute = pathOr(undefined, ['dashboard', 'nextRoute'])

function* gotoNextRoute() {
  try {
    const nextRoute: Action = yield select(getNextRoute)
    if (nextRoute) {
      yield put(nextRoute)
      yield put(DashboardActionsfrom.nextRouteSucceeded())
    } else {
      yield put(NavAction.navigate('App'))
    }
  } catch (error) {
    yield put(DashboardActionsfrom.nextRouteFailed(error))
  }
}

function* retrieveTokens({ url }: any) {
  try {
    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    } = yield call(retrieveTokensAsync, url)

    if (
      typeof access_token !== 'undefined' &&
      typeof refresh_token !== 'undefined'
    ) {
      const user = {
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
      }

      KeycloakInfo.token = access_token
      KeycloakInfo.refreshToken = refresh_token
      KeycloakInfo.expiresIn = expires_in

      yield call(persistExpireInAsync, expires_in)
      yield call(setStorageItemEncrypted, TOKEN_KEY, JSON.stringify(user))
      yield put(Actions.loginSucceeded(user))
      yield asyncAction(Actions.getLimitedAccessTokenRequested())
      yield asyncAction(Actions.initialLoadingRequested())
      yield call(gotoNextRoute)
    } else {
      if (!__DEV__) {
        Sentry.Native.captureException(
          new Error('access_token or refresh_token undefined'),
        )
      }
      yield put(NavAction.immediatelyResetStack(['error']))
    }
  } catch (e) {
    yield put(Actions.loginFailed(e))
    yield put(
      NavAction.showLocalError(i18n.t('login.errors.retrieveTokens'), 'login'),
    )
  }
}

function* loginError() {
  try {
    yield put(NavAction.immediatelyResetStack(['error']))
  } catch (e) {
    yield put(Actions.loginFailed(e))
  }
}

function* getLimitedAccessTokenFromStorage() {
  try {
    const limitedAccessToken: string = yield call(
      getLimitedAccessTokenFromStoreAsync,
      LIMITED_ACCESS_TOKEN_KEY,
    )
    const limitedAccessTokenExp: number = yield call(
      getLimitedAccessTokenExpirationFromStoreAsync,
    )

    if (
      limitedAccessToken &&
      limitedAccessTokenExp &&
      Date.now() < Number(limitedAccessTokenExp)
    ) {
      yield put(
        Actions.getLimitedAccessTokenSucceeded(
          limitedAccessToken,
          limitedAccessTokenExp,
        ),
      )
    } else {
      const isLogin: boolean = yield select(isLoggedInSelector)
      if (!isLogin) {
        yield put(AppointmentsListActions.appointmentslistLoaded())
        yield put(NavAction.push('Auth'))
      }
    }
  } catch (e) {
    yield put(Actions.getLimitedAccessTokenFailed(e))
    yield put(
      NavAction.showLocalError(
        i18n.t('login.errors.getLimitedAccessTokenAsync'),
      ),
    )
  }
}

const getLimitedAccessToken = function* getLimitedAccessTokenFn() {
  try {
    const isLogin: boolean = yield select(isLoggedInSelector)
    if (isLogin) {
      const { limitedAccessToken, limitedAccessTokenExp } = yield call(
        getLimitedAccessTokenAsync,
      )
      yield put(
        Actions.getLimitedAccessTokenSucceeded(
          limitedAccessToken,
          limitedAccessTokenExp,
        ),
      )
    } else {
      yield call(getLimitedAccessTokenFromStorage)
    }
  } catch (e) {
    yield put(Actions.getLimitedAccessTokenFailed(e))
    yield put(
      NavAction.showLocalError(
        i18n.t('login.errors.getLimitedAccessTokenAsync'),
      ),
    )
  }
}

const initialLoading = function* initialLoadingFn() {
  try {
    yield asyncAction(userActions.profileFetchRequested())
    yield asyncAction(messagingActions.getSubscriptionsRequested())
    yield asyncAction(healthrelationActions.loadAllPatientsRequested())
    yield asyncAction(healthrelationActions.getAvailabilitiesRequested())
    yield asyncAction(surveyActions.getMySurveysRequested())
    yield put(Actions.initialLoadingSucceeded())
  } catch (e) {
    yield put(Actions.initialLoadingFailed(e))
    yield put(NavAction.showLocalError(i18n.t('login.errors.getMe')))
  }
}

const relogin = function* reloginFn() {
  yield put(PersistStoreActions.stopPersistStore())
  yield delay(1500)
  yield call(Updates.reloadAsync)
}

function initSentry({ payload: { id } }: any) {
  if (!__DEV__) {
    Sentry.Native.setUser({ id })
  }
}

function initKeycloack({ payload: { uid } }: any) {
  KeycloakInfo.userId = uid
}

const injectStateFromPersist = function* injectStateFromPersistFn() {
  yield put(PersistStoreActions.startPersistStore())
}

const loadPatients = function* loadPatientsFn() {
  const patientIds: any[] = yield select(
    pipe(
      path<any[]>(['healthrelation', 'patients']),
      map(prop('uuid')),
    ),
  )
  const primaryPhysicianUuids: any[] = yield select(
    pipe(
      path<any[]>(['healthrelation', 'patients']),
      map(prop('primaryPhysicianUuid')),
    ),
  )
  yield all(
    patientIds.map((id: any) =>
      put(healthrelationActions.loadPatientRequested(id)),
    ),
  )
  yield put(
    healthrelationActions.loadMissingProfessionals(primaryPhysicianUuids),
  )
}

function* removeExpiresIn() {
  yield call(deleteStorageItem, 'expiresIn')
}

export default [
  takeEvery(userActionTypes.PROFILE_FETCH_SUCCEEDED, initSentry),
  takeEvery(userActionTypes.PROFILE_FETCH_SUCCEEDED, initKeycloack),
  takeEvery(
    healthrelationActionTypes.LOAD_ALL_PATIENTS_SUCCEEDED,
    loadPatients,
  ),
  takeEvery(ActionTypes.INITIAL_LOADING_REQUESTED, initialLoading),
  takeEvery(ActionTypes.INITIAL_LOADING_SUCCEEDED, injectStateFromPersist),
  takeEvery(ActionTypes.LOGIN_REQUESTED, retrieveTokens),
  takeEvery(ActionTypes.LOGIN_FAILED, loginError),
  takeEvery(ActionTypes.RELOGIN_REQUESTED, relogin),
  takeEvery(ActionTypes.GET_LIMITED_ACCESS_TOKEN_FAILED, removeExpiresIn),
  takeEvery(
    ActionTypes.GET_LIMITED_ACCESS_TOKEN_REQUESTED,
    getLimitedAccessToken,
  ),
]
