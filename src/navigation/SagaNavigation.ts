import { put, takeLatest } from 'redux-saga/effects'

import { NavigationService } from 'navigation/NavigationService'

export const ActionTypes = {
  NAV_POP: 'NAV_POP',
  NAV_IMMEDIATELY_RESET_STACK: 'NAV_IMMEDIATELY_RESET_STACK',
  NAV_PUSH: 'NAV_PUSH',
  NAV_NAVIGATE: 'NAV_NAVIGATE',
  NAV_POP_TO_TOP: 'NAV_POP_TO_TOP',
  NAV_SHOW_LOCAL_ALERT: 'NAV_SHOW_LOCAL_ALERT',
  NAV_HIDE_LOCAL_ALERT: 'NAV_HIDE_LOCAL_ALERT',
  NAV_OK: 'NAV_OK',
  NAV_ERROR: 'NAV_ERROR',
}

export interface RouteAction {
  type: string
  route?: string
  params?: any
}

export class Actions {
  static push(route: string, params?: any) {
    return { type: ActionTypes.NAV_PUSH, route, params }
  }
  static navigate(route: string) {
    return { type: ActionTypes.NAV_NAVIGATE, route }
  }
  static pop() {
    return { type: ActionTypes.NAV_POP }
  }
  static popToTop() {
    return { type: ActionTypes.NAV_POP_TO_TOP }
  }
  static showLocalError(message: string, ignoreOnRoute?: string) {
    return {
      type: ActionTypes.NAV_SHOW_LOCAL_ALERT,
      message,
      options: { type: 'error', title: 'Error' },
      ignoreOnRoute,
    }
  }
  static showLocalWarning(message: string, ignoreOnRoute?: string) {
    return {
      type: ActionTypes.NAV_SHOW_LOCAL_ALERT,
      message,
      options: { type: 'warn', title: 'Warning' },
      ignoreOnRoute,
    }
  }
  static showLocalNotice(message: string, ignoreOnRoute?: string) {
    return {
      type: ActionTypes.NAV_SHOW_LOCAL_ALERT,
      message,
      options: { type: 'info', title: 'Info' },
      ignoreOnRoute,
    }
  }
  static immediatelyResetStack(routes: string[]) {
    return {
      type: ActionTypes.NAV_IMMEDIATELY_RESET_STACK,
      routes,
    }
  }
  static navSucceeded(route?: string) {
    return { type: ActionTypes.NAV_OK, route }
  }
  static navFailed(message: string) {
    return { type: ActionTypes.NAV_ERROR, message }
  }
}

const pop = function* popFn() {
  try {
    NavigationService.pop()
    yield put(Actions.navSucceeded(NavigationService.getCurrentRoute()))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

const popToTop = function* popToTopFn() {
  try {
    NavigationService.popToTop()
    yield put(Actions.navSucceeded(NavigationService.getCurrentRoute()))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

const push = function* pushFn({ route, params }: any) {
  try {
    if (NavigationService.getCurrentRoute() !== route) {
      NavigationService.push(route, params)
    }
    yield put(Actions.navSucceeded(route))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

const showLocalAlert = function* showLocalAlertFn({
  message,
  options,
  ignoreOnRoute,
}: any) {
  try {
    if (NavigationService.getCurrentRoute() !== ignoreOnRoute) {
      NavigationService.showLocalAlert(message, options)
    }
    yield put(Actions.navSucceeded(NavigationService.getCurrentRoute()))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

const immediatelyResetStack = function* immediatelyResetStackFn({
  routes,
}: any) {
  try {
    NavigationService.reset(routes)
    yield put(Actions.navSucceeded(NavigationService.getCurrentRoute()))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

const navigate = function* navigateFn({ route }: any) {
  try {
    NavigationService.navigate(route, {})
    yield put(Actions.navSucceeded(NavigationService.getCurrentRoute()))
  } catch (err) {
    yield put(Actions.navFailed(err.message))
  }
}

export default [
  takeLatest(ActionTypes.NAV_POP, pop),
  takeLatest(ActionTypes.NAV_IMMEDIATELY_RESET_STACK, immediatelyResetStack),
  takeLatest(ActionTypes.NAV_POP_TO_TOP, popToTop),
  takeLatest(ActionTypes.NAV_PUSH, push),
  takeLatest(ActionTypes.NAV_NAVIGATE, navigate),
  takeLatest(ActionTypes.NAV_SHOW_LOCAL_ALERT, showLocalAlert),
  takeLatest(ActionTypes.NAV_SHOW_LOCAL_ALERT, showLocalAlert),
]
