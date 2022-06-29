import { Tokens } from 'api/types'
import { RouteAction } from 'navigation/SagaNavigation'

export const ActionTypes = {
  ENABLE_NOTIFICATION_REQUESTED: 'ENABLE_NOTIFICATION_REQUESTED',
  ENABLE_NOTIFICATION_SUCCEEDED: 'ENABLE_NOTIFICATION_SUCCEEDED',
  ENABLE_NOTIFICATION_FAILED: 'ENABLE_NOTIFICATION_FAILED',
  LOGOUT_REQUESTED: 'LOGOUT_REQUESTED',
  LOGOUT_SUCCEEDED: 'LOGOUT_SUCCEEDED',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  REFRESH_TOKEN_REQUESTED: 'REFRESH_TOKEN_REQUESTED',
  REFRESH_TOKEN_SUCCEEDED: 'REFRESH_TOKEN_SUCCEEDED',
  REFRESH_TOKEN_FAILED: 'REFRESH_TOKEN_FAILED',
  REFRESH_TOKEN_CANCELLED: 'REFRESH_TOKEN_CANCELLED',
  APP_STATE_CHANGE: 'APP_STATE_CHANGE',
  CONNECTIVITY_CHANGE: 'CONNECTIVITY_CHANGE',
  GOTO_LOCKED_DASHBOARD_REQUESTED: 'GOTO_LOCKED_DASHBOARD_REQUESTED',
  GOTO_LOCKED_DASHBOARD_SUCCEEDED: 'GOTO_LOCKED_DASHBOARD_SUCCEEDED',
  GOTO_LOCKED_DASHBOARD_FAILED: 'GOTO_LOCKED_DASHBOARD_FAILED',
  LOGIN_WITH_NEXT_ROUTE_REQUESTED: 'LOGIN_WITH_NEXT_ROUTE_REQUESTED',
  LOGIN_WITH_NEXT_ROUTE_SUCCEEDED: 'LOGIN_WITH_NEXT_ROUTE_SUCCEEDED',
  LOGIN_WITH_NEXT_ROUTE_FAILED: 'LOGIN_WITH_NEXT_ROUTE_FAILED',
  NEXT_ROUTE_SUCCEEDED: 'NEXT_ROUTE_SUCCEEDED',
  NEXT_ROUTE_FAILED: 'NEXT_ROUTE_FAILED',
  SHOW_VERIFY_NOTIFS_REQUESTED: 'SHOW_VERIFY_NOTIFS_REQUESTED',
  HIDE_VERIFY_NOTIFS_REQUESTED: 'HIDE_VERIFY_NOTIFS_REQUESTED',
  SHOW_TERMS: 'SHOW_TERMS',
  HIDE_TERMS: 'HIDE_TERMS',
  NEW_APP_VERSION_REQUESTED: 'NEW_APP_VERSION_REQUESTED',
  NEW_APP_VERSION_SUCCEEDED: 'NEW_APP_VERSION_SUCCEEDED',
  NEW_APP_VERSION_FAILED: 'NEW_APP_VERSION_FAILED',
  REFRESH_DASHBOARD: 'REFRESH_DASHBOARD',
  GET_LOGGED_IN_USER_DETAILS_REQUESTED: 'GET_LOGGED_IN_USER_DETAILS_REQUESTED',
  GET_LOGGED_IN_USER_DETAILS_SUCCEEDED: 'GET_LOGGED_IN_USER_DETAILS_SUCCEEDED',
  GET_LOGGED_IN_USER_DETAILS_FAILED: 'GET_LOGGED_IN_USER_DETAILS_FAILED',
}

export default class Actions {
  static logOutRequested(clearStorage: boolean = false) {
    return { type: ActionTypes.LOGOUT_REQUESTED, clearStorage }
  }
  static logOutSucceeded() {
    return { type: ActionTypes.LOGOUT_SUCCEEDED }
  }
  static logOutFailed(error: Error) {
    return {
      type: ActionTypes.LOGOUT_FAILED,
      message: error.message,
      error,
    }
  }
  static enableNotificationsRequested() {
    return { type: ActionTypes.ENABLE_NOTIFICATION_REQUESTED }
  }
  static enableNotificationsSucceeded() {
    return { type: ActionTypes.ENABLE_NOTIFICATION_SUCCEEDED }
  }
  static enableNotificationsFailed(error: Error) {
    return {
      type: ActionTypes.ENABLE_NOTIFICATION_FAILED,
      message: error.message,
      error,
    }
  }

  static refreshTokenSucceeded(result: Tokens) {
    return { type: ActionTypes.REFRESH_TOKEN_SUCCEEDED, result }
  }
  static refreshTokenCancelled() {
    return { type: ActionTypes.REFRESH_TOKEN_CANCELLED }
  }
  static refreshTokenFailed(error: Error) {
    return {
      type: ActionTypes.REFRESH_TOKEN_FAILED,
      message: error.message,
      error,
    }
  }
  static gotoLockedDashboardRequested() {
    return { type: ActionTypes.GOTO_LOCKED_DASHBOARD_REQUESTED }
  }
  static gotoLockedDashboardSucceeded() {
    return { type: ActionTypes.GOTO_LOCKED_DASHBOARD_SUCCEEDED }
  }
  static gotoLockedDashboardFailed(error: Error) {
    return {
      type: ActionTypes.GOTO_LOCKED_DASHBOARD_FAILED,
      message: error.message,
      error,
    }
  }
  static loginWithNextRouteRequested(nextRoute: RouteAction) {
    return {
      type: ActionTypes.LOGIN_WITH_NEXT_ROUTE_REQUESTED,
      payload: { nextRoute },
    }
  }
  static loginWithNextRouteSucceeded() {
    return { type: ActionTypes.LOGIN_WITH_NEXT_ROUTE_SUCCEEDED }
  }
  static loginWithNextRouteFailed(error: Error) {
    return {
      type: ActionTypes.LOGIN_WITH_NEXT_ROUTE_FAILED,
      message: error.message,
      error,
    }
  }
  static nextRouteSucceeded() {
    return { type: ActionTypes.NEXT_ROUTE_SUCCEEDED }
  }
  static nextRouteFailed(error: Error) {
    return {
      type: ActionTypes.NEXT_ROUTE_FAILED,
      message: error.message,
      error,
    }
  }
  static showVerifyNotificationRequested() {
    return { type: ActionTypes.SHOW_VERIFY_NOTIFS_REQUESTED }
  }
  static hideVerifyNotificationRequested() {
    return { type: ActionTypes.HIDE_VERIFY_NOTIFS_REQUESTED }
  }
  static showTerms() {
    return { type: ActionTypes.SHOW_TERMS }
  }
  static hideTerms() {
    return { type: ActionTypes.HIDE_TERMS }
  }

  static newAppVersionRequested() {
    return { type: ActionTypes.NEW_APP_VERSION_REQUESTED }
  }
  static newAppVersionSucceeded(reason?: string) {
    return { type: ActionTypes.NEW_APP_VERSION_SUCCEEDED, payload: reason }
  }
  static newAppVersionFailed(error: Error) {
    return { type: ActionTypes.NEW_APP_VERSION_FAILED, payload: { error } }
  }
  static refreshDashboard() {
    return { type: ActionTypes.REFRESH_DASHBOARD, payload: undefined }
  }

  static loggedInUserDetails() {
    return { type: ActionTypes.GET_LOGGED_IN_USER_DETAILS_REQUESTED }
  }

  static loggedInUserDetailsSucceeded(data?: any) {
    return {
      type: ActionTypes.GET_LOGGED_IN_USER_DETAILS_SUCCEEDED,
      payload: data,
    }
  }
  static loggedInUserDetailsFailed(error: Error) {
    return {
      type: ActionTypes.GET_LOGGED_IN_USER_DETAILS_FAILED,
      payload: { error },
    }
  }
}
