import { combineReducers } from 'redux'
import { pick } from 'ramda'

import { Env } from 'env'

import NavigationReducer from 'navigation/reducer'
import NotificationsReducer from 'notifications/reducers'
import LoginReducer from 'screens/Login/Login.reducer'
import DashboardReducer from 'screens/Dashboard/Dashboard.reducer'
import AppointmentReducer from 'screens/Appointment/Appointment.reducer'
import AppointmentsListReducer from 'screens/AppointmentsList/AppointmentsList.reducer'
import { reducers } from 'common-docdok'
import PhotoViewerReducer from 'screens/PhotoViewer/PhotoViewer.reducer'
import BookAppointmentReducer from 'screens/BookAppointment/BookAppointment.reducer'
import PdfReaderReducer from 'screens/PdfReader/PdfReader.reducer'
import ScheduleAppointmentReducer from 'screens/ScheduleAppointment/ScheduleAppointment.reducer'
import AppointmentConfirmationReducer from 'screens/AppointmentConfirmation/AppointmentConfirmation.reducer'
import GraphicReducer from 'screens/Graphic/Graphic.reducer'
import ConversationsReducer from 'screens/ConversationsList/ConversationsList.reducer'
import CalendarEventReducer from 'screens/CalendarEvent/CalendarEvent.reducer'

// PREPEND REDUCER IMPORT HERE

const appReducer = combineReducers<any>({
  navigation: NavigationReducer,
  notifications: NotificationsReducer,
  [Env.storage.authKey]: LoginReducer,
  dashboard: DashboardReducer,
  appointment: AppointmentReducer,
  appointmentslist: AppointmentsListReducer,
  photoviewer: PhotoViewerReducer,
  bookappointment: BookAppointmentReducer,
  pdfreader: PdfReaderReducer,
  scheduleappointment: ScheduleAppointmentReducer,
  appointmentconfirmation: AppointmentConfirmationReducer,
  graphic: GraphicReducer,
  conversation: ConversationsReducer,
  calendarEvents: CalendarEventReducer,
  // PREPEND REDUCER HERE
  ...reducers,
})

function rootReducer(state: any, action: { type: string }) {
  if (action.type !== 'CLEAR_STORE') {
    return appReducer(state, action)
  }

  const clearState = pick(['navigation'], state)
  return appReducer(clearState, action)
}

export default rootReducer
