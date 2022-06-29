import LoginScreen from 'screens/Login/Login.component'
import DashboardScreen from 'screens/Dashboard/Dashboard.component'
import ChatScreen from 'screens/Chat/Chat.component'
import ProfileScreen from 'screens/Profile/Profile.component'
import SurveyScreen from 'screens/Survey/Survey.component'
import SurveyWebviewScreen from 'screens/SurveyWebview/SurveyWebview.component'
import NotificationsListScreen from 'screens/NotificationsList/NotificationsList.component'
import ConversationsListScreen from 'screens/ConversationsList/ConversationsList.component'
import AppointmentScreen from 'screens/Appointment/Appointment.component'
import AppointmentsListScreen from 'screens/AppointmentsList/AppointmentsList.component'
import PhotoViewerScreen from 'screens/PhotoViewer/PhotoViewer.component'
import DossierScreen from 'screens/Dossier/Dossier.component'
import DossierDetailScreen from 'screens/DossierDetail/DossierDetail.component'
import SurveyByDossierScreen from 'screens/SurveyByDossier/SurveyByDossier.component'
import BookAppointmentScreen from 'screens/BookAppointment/BookAppointment.component'
import AvailabilityListScreen from 'screens/AvailabilityList/AvailabilityList.component'
import AvailabilityDetailScreen from 'screens/AvailabilityDetail/AvailabilityDetail.component'
import PdfReaderScreen from 'screens/PdfReader/PdfReader.component'
import ScheduleAppointmentScreen from 'screens/ScheduleAppointment/ScheduleAppointment.component'
import AppointmentConfirmationScreen from 'screens/AppointmentConfirmation/AppointmentConfirmation.component'
import GraphicScreen from 'screens/Graphic/Graphic.component'
import ComingSoonScreen from 'screens/ComingSoon/ComingSoon.component'
import { NavigationRouteConfigMap } from 'react-navigation'
import {
  StackNavigationOptions,
  StackNavigationProp,
} from 'react-navigation-stack/lib/typescript/src/vendor/types'
import CalendarEventScreen from 'screens/CalendarEvent/CalendarEvent.component'
import CalendarEventListScreen from 'screens/CalendarEvent/CalendarEventList.component'
import CalendarEventAddScreen from 'screens/CalendarEvent/CalendarEventAdd.component'
// PREPEND SCREEN IMPORT HERE

const routerConfig: NavigationRouteConfigMap<
  StackNavigationOptions,
  StackNavigationProp
> = {
  // PREPEND SCREEN HERE
  calendarEventAdd: { screen: CalendarEventAddScreen },
  calendareventlist: { screen: CalendarEventScreen },
  calendareventLoadList: { screen: CalendarEventListScreen },
  graphic: { screen: GraphicScreen },
  appointmentconfirmation: { screen: AppointmentConfirmationScreen },
  dossierdetail: { screen: DossierDetailScreen },
  surveybydossier: { screen: SurveyByDossierScreen },
  bookappointment: { screen: BookAppointmentScreen },
  availabilitylist: { screen: AvailabilityListScreen },
  availabilitydetail: { screen: AvailabilityDetailScreen },
  pdfreader: {
    screen: PdfReaderScreen,
    navigationOptions: () => ({
      headerShown: false,
      header: () => null,
    }),
  },
  scheduleappointment: { screen: ScheduleAppointmentScreen },
  login: {
    screen: LoginScreen,
    navigationOptions: () => ({
      headerShown: false,
      header: () => null,
    }),
  },
  dashboard: { screen: DashboardScreen },
  chat: { screen: ChatScreen },
  profile: { screen: ProfileScreen },
  survey: { screen: SurveyScreen },
  surveywebview: { screen: SurveyWebviewScreen },
  notificationslist: { screen: NotificationsListScreen },
  conversationslist: { screen: ConversationsListScreen },
  appointment: { screen: AppointmentScreen },
  appointmentslist: { screen: AppointmentsListScreen },
  photoviewer: {
    screen: PhotoViewerScreen,
    navigationOptions: () => ({
      headerShown: false,
      header: () => null,
    }),
  },
  dossier: { screen: DossierScreen },
  comingsoon: { screen: ComingSoonScreen },
}

export default routerConfig
