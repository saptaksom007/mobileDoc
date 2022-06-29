import { Tokens } from 'api/types'

export const ActionTypes = {
  LOGIN_REQUESTED: 'LOGIN_REQUESTED',
  LOGIN_SUCCEEDED: 'LOGIN_SUCCEEDED',
  LOGIN_FAILED: 'LOGIN_FAILED',
  INITIAL_LOADING_REQUESTED: 'INITIAL_LOADING_REQUESTED',
  INITIAL_LOADING_SUCCEEDED: 'INITIAL_LOADING_SUCCEEDED',
  INITIAL_LOADING_FAILED: 'INITIAL_LOADING_FAILED',
  SESSION_HAS_EXPIRED: 'SESSION_HAS_EXPIRED',
  RELOGIN_REQUESTED: 'RELOGIN_REQUESTED',
  SET_IS_LOGIN: 'SET_IS_LOGIN',
  GET_LIMITED_ACCESS_TOKEN_REQUESTED: 'GET_LIMITED_ACCESS_TOKEN_REQUESTED',
  GET_LIMITED_ACCESS_TOKEN_SUCCEEDED: 'GET_LIMITED_ACCESS_TOKEN_SUCCEEDED',
  GET_LIMITED_ACCESS_TOKEN_FAILED: 'GET_LIMITED_ACCESS_TOKEN_FAILED',
}

export default class Actions {
  static loginRequested(url: string) {
    return {
      type: ActionTypes.LOGIN_REQUESTED,
      url,
    }
  }
  static loginSucceeded(user: Tokens) {
    return {
      type: ActionTypes.LOGIN_SUCCEEDED,
      payload: { user },
    }
  }
  static loginFailed(error: Error) {
    return {
      type: ActionTypes.LOGIN_FAILED,
      message: error.message,
      error,
    }
  }
  static initialLoadingRequested() {
    return {
      type: ActionTypes.INITIAL_LOADING_REQUESTED,
    }
  }
  static initialLoadingSucceeded() {
    return {
      type: ActionTypes.INITIAL_LOADING_SUCCEEDED,
    }
  }
  static initialLoadingFailed(error: Error) {
    return {
      type: ActionTypes.INITIAL_LOADING_FAILED,
      message: error.message,
      error,
    }
  }
  static sessionHasExpired() {
    return { type: ActionTypes.SESSION_HAS_EXPIRED }
  }
  static getLimitedAccessTokenRequested() {
    return { type: ActionTypes.GET_LIMITED_ACCESS_TOKEN_REQUESTED }
  }
  static getLimitedAccessTokenSucceeded(
    limitedAccessToken: string,
    limitedAccessTokenExp: number,
  ) {
    return {
      type: ActionTypes.GET_LIMITED_ACCESS_TOKEN_SUCCEEDED,
      limitedAccessToken,
      limitedAccessTokenExp,
    }
  }
  static getLimitedAccessTokenFailed(error: Error) {
    return {
      type: ActionTypes.GET_LIMITED_ACCESS_TOKEN_FAILED,
      message: error.message,
      error,
    }
  }
  static setIsLogin(user: Partial<Tokens> & { isLoggedIn: boolean }) {
    return {
      type: ActionTypes.SET_IS_LOGIN,
      payload: user,
    }
  }
}
