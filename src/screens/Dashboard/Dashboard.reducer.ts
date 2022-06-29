import { pathOr } from 'ramda'
import { userActionTypes } from 'common-docdok/lib/domain/user/actions'

import { ActionTypes } from './Dashboard.actions'

const {
  ENABLE_NOTIFICATION_REQUESTED,
  ENABLE_NOTIFICATION_SUCCEEDED,
  ENABLE_NOTIFICATION_FAILED,
  REFRESH_TOKEN_FAILED,
  LOGOUT_FAILED,
  GOTO_LOCKED_DASHBOARD_SUCCEEDED,
  APP_STATE_CHANGE,
  CONNECTIVITY_CHANGE,
  LOGIN_WITH_NEXT_ROUTE_REQUESTED,
  NEXT_ROUTE_SUCCEEDED,
  NEXT_ROUTE_FAILED,
  SHOW_VERIFY_NOTIFS_REQUESTED,
  HIDE_VERIFY_NOTIFS_REQUESTED,
  SHOW_TERMS,
  HIDE_TERMS,
  GET_LOGGED_IN_USER_DETAILS_REQUESTED,
  GET_LOGGED_IN_USER_DETAILS_SUCCEEDED,
  GET_LOGGED_IN_USER_DETAILS_FAILED,
} = ActionTypes

const {
  UPDATE_TERMS_VERSION_SUCCEEDED,
  TERMS_VERSION_CHANGED,
  TERMS_VERSION_EQUALS,
} = userActionTypes

interface RouteType {
  type: 'NAV_PUSH_REQUESTED'
  route: string
  params?: any
}

interface State {
  error?: string
  limitedAccess: boolean
  currentAppState?: string
  connectivityState?: boolean
  nextRoute?: RouteType
  isVerifNotifDisplay?: boolean
  agreeTerm: boolean
  termsVersion?: string
  loggedInUserDetails?: any
}

interface Action {
  type: keyof typeof ActionTypes
  message?: string
  currentAppState: string
  payload?: any
}

const initialState: State = {
  error: undefined,
  limitedAccess: false,
  currentAppState: undefined,
  connectivityState: true,
  nextRoute: undefined,
  isVerifNotifDisplay: false,
  agreeTerm: false,
  termsVersion: undefined,
  loggedInUserDetails: null,
}

const DEFAULT_TERMS_VERSION = '2018-04-03'

export default function dashboard(state: State = initialState, action: Action) {
  switch (action.type) {
    case ENABLE_NOTIFICATION_REQUESTED: {
      return {
        ...state,
        error: undefined,
      }
    }

    case ENABLE_NOTIFICATION_SUCCEEDED: {
      return {
        ...state,
        error: undefined,
      }
    }

    case ENABLE_NOTIFICATION_FAILED: {
      return {
        ...state,
        error: action.message,
      }
    }

    case REFRESH_TOKEN_FAILED: {
      return { ...state, error: action.message }
    }

    case LOGOUT_FAILED: {
      return { ...state, error: action.message }
    }

    case GOTO_LOCKED_DASHBOARD_SUCCEEDED: {
      return { ...state, limitedAccess: true }
    }

    case APP_STATE_CHANGE: {
      const { currentAppState } = action
      return { ...state, currentAppState }
    }

    case CONNECTIVITY_CHANGE: {
      const connectivityState: boolean = pathOr(
        true,
        ['payload', 'isConnected'],
        action,
      )
      return { ...state, connectivityState }
    }

    case TERMS_VERSION_EQUALS: {
      return { ...state, agreeTerm: true }
    }

    case TERMS_VERSION_CHANGED: {
      const termsVersion: string = pathOr(
        DEFAULT_TERMS_VERSION,
        ['payload', 'termsVersion'],
        action,
      )
      return { ...state, agreeTerm: false, termsVersion }
    }

    case UPDATE_TERMS_VERSION_SUCCEEDED: {
      return { ...state, agreeTerm: true }
    }

    case LOGIN_WITH_NEXT_ROUTE_REQUESTED: {
      const nextRoute: RouteType = pathOr(
        undefined,
        ['payload', 'nextRoute'],
        action,
      )
      return { ...state, nextRoute }
    }

    case NEXT_ROUTE_SUCCEEDED: {
      return { ...state, nextRoute: undefined }
    }

    case NEXT_ROUTE_FAILED: {
      return { ...state, nextRoute: undefined }
    }

    case SHOW_VERIFY_NOTIFS_REQUESTED: {
      return { ...state, isVerifNotifDisplay: true }
    }

    case HIDE_VERIFY_NOTIFS_REQUESTED: {
      return { ...state, isVerifNotifDisplay: false }
    }

    case SHOW_TERMS: {
      return { ...state, showTerms: true }
    }

    case HIDE_TERMS: {
      return { ...state, showTerms: false }
    }

    case GET_LOGGED_IN_USER_DETAILS_REQUESTED: {
      return {
        ...state,
        loggedInUserDetails: null,
        error: undefined,
      }
    }

    case GET_LOGGED_IN_USER_DETAILS_SUCCEEDED: {
      return {
        ...state,
        loggedInUserDetails: action.payload,
        error: undefined,
      }
    }

    case GET_LOGGED_IN_USER_DETAILS_FAILED: {
      return {
        ...state,
        loggedInUserDetails: null,
        error: action.message,
      }
    }

    default:
      return state
  }
}
