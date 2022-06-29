import { ActionTypes as DashboardActionTypes } from 'screens/Dashboard/Dashboard.actions'
import { ActionTypes } from './Login.actions'

const {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  SESSION_HAS_EXPIRED,
  RELOGIN_REQUESTED,
  GET_LIMITED_ACCESS_TOKEN_REQUESTED,
  GET_LIMITED_ACCESS_TOKEN_SUCCEEDED,
  GET_LIMITED_ACCESS_TOKEN_FAILED,
  SET_IS_LOGIN,
} = ActionTypes

const { REFRESH_TOKEN_SUCCEEDED, LOGOUT_SUCCEEDED } = DashboardActionTypes

const initialState = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
  refresh_expires_in: undefined,
  limitedAccessToken: undefined,
  limitedAccessTokenExp: 0,
  isLimitedAccessTokenError: false,
  isLoggedIn: false,
  sessionHasExpired: false,
}

export default function login(state: any = initialState, action: any): any {
  switch (action.type) {
    case LOGIN_REQUESTED: {
      return {
        ...state,
        access_token: undefined,
        refresh_token: undefined,
        expires_in: undefined,
        refresh_expires_in: undefined,
        limited_access_token: undefined,
        isLoggedIn: false,
      }
    }

    case LOGIN_SUCCEEDED: {
      const {
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
      } = action.payload.user
      return {
        ...state,
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
        isLoggedIn: true,
        sessionHasExpired: false,
      }
    }

    case GET_LIMITED_ACCESS_TOKEN_REQUESTED: {
      return {
        ...state,
      }
    }

    case GET_LIMITED_ACCESS_TOKEN_SUCCEEDED: {
      const { limitedAccessToken, limitedAccessTokenExp } = action
      return {
        ...state,
        limitedAccessToken,
        limitedAccessTokenExp,
      }
    }

    case GET_LIMITED_ACCESS_TOKEN_FAILED: {
      return {
        ...state,
        isLimitedAccessTokenError: true,
      }
    }

    case REFRESH_TOKEN_SUCCEEDED: {
      const {
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
      } = action.result
      return {
        ...state,
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
        isLoggedIn: true,
      }
    }

    case LOGIN_FAILED: {
      return {
        ...state,
        error: action.message,
        access_token: undefined,
        refresh_token: undefined,
        expires_in: undefined,
        refresh_expires_in: undefined,
        isLoggedIn: false,
      }
    }

    case LOGOUT_SUCCEEDED: {
      const { limitedAccessToken, limitedAccessTokenExp } = state
      return {
        ...state,
        isLoggedIn: false,
        access_token: undefined,
        refresh_token: undefined,
        refresh_expires_in: undefined,
        limitedAccessToken,
        limitedAccessTokenExp,
      }
    }

    case SESSION_HAS_EXPIRED: {
      return {
        ...state,
        sessionHasExpired: true,
      }
    }

    case RELOGIN_REQUESTED: {
      return {
        ...state,
        sessionHasExpired: false,
        isLoggedIn: false,
      }
    }

    case SET_IS_LOGIN: {
      return {
        ...state,
        ...action.payload,
      }
    }

    default:
      return state
  }
}
