import { ActionTypes } from './CalendarEvent.actions'

const {
  NAVIGATE_TO_CALENDER_EVENTS_LIST,
  NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST,
  NAVIGATE_TO_CALENDER_EVENTS_ADD,
  ADD_CALENDAR_EVENT_REQUESTED,
  ADD_CALENDAR_EVENT_SUCCEEDED,
  ADD_CALENDAR_EVENT_FAILED,
  GET_CALENDAR_EVENT_REQUESTED,
  GET_CALENDAR_EVENT_SUCCEEDED,
  GET_CALENDAR_EVENT_FAILED,
  DELETE_CALENDAR_EVENT_REQUESTED,
  DELETE_CALENDAR_EVENT_SUCCEEDED,
  DELETE_CALENDAR_EVENT_FAILED,
  SET_CALENDAR_EVENT_ATTACHMENT,
} = ActionTypes

const initialState = {
  error: undefined,
  navigationData: {},
  type: '',
  currentItem: {},
  addLoading: false,
  loading: true,
  deleteLoading: false,
  events: {},
  eventsArr: [],
  attachmentURL: null,
}

export default function calendarEvents(
  state: typeof initialState = initialState,
  action: { type: keyof typeof ActionTypes; payload: any },
) {
  switch (action.type) {
    case NAVIGATE_TO_CALENDER_EVENTS_LIST: {
      return { ...state, navigationData: action.payload }
    }

    case NAVIGATE_TO_CALENDER_EVENTS_LOAD_LIST: {
      return { ...state, type: action.payload }
    }

    case NAVIGATE_TO_CALENDER_EVENTS_ADD: {
      return { ...state, currentItem: action.payload }
    }

    case ADD_CALENDAR_EVENT_REQUESTED: {
      return { ...state, addLoading: true }
    }

    case ADD_CALENDAR_EVENT_SUCCEEDED: {
      return { ...state, addLoading: false }
    }

    case ADD_CALENDAR_EVENT_FAILED: {
      return { ...state, addLoading: false }
    }

    case GET_CALENDAR_EVENT_REQUESTED: {
      return { ...state, events: {}, loading: true }
    }

    case GET_CALENDAR_EVENT_SUCCEEDED: {
      return {
        ...state,
        events: action.payload?.eventsObj,
        eventsArr: action.payload?.events,
        loading: false,
      }
    }

    case GET_CALENDAR_EVENT_FAILED: {
      return { ...state, loading: false }
    }

    case DELETE_CALENDAR_EVENT_REQUESTED: {
      return { ...state, deleteLoading: true }
    }

    case DELETE_CALENDAR_EVENT_SUCCEEDED: {
      return { ...state, deleteLoading: false }
    }

    case DELETE_CALENDAR_EVENT_FAILED: {
      return { ...state, deleteLoading: false }
    }
    case SET_CALENDAR_EVENT_ATTACHMENT: {
      return { ...state, attachmentURL: action.payload }
    }

    default:
      return state
  }
}
