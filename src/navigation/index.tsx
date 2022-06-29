import React from 'react'

import AuthLoading from 'components/AuthLoading/AuthLoading.component'
import { HeaderTitle } from 'components/HeaderTitle/HeaderTitle.component'
import { HeaderNavRight } from 'components/HeaderNavRight/HeaderNavRight.component'
import { NavigationService } from 'navigation/NavigationService'
import { Layout } from 'constants/Layout'

import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Router from './Router'
import { StackNavigationOptions } from 'react-navigation-stack/lib/typescript/src/vendor/types'
import { Color } from 'constants/Color'
import { APIContext } from 'api'

export const ICON_SIZE: number = Layout.window.height * 0.05

const {
  dashboard,
  appointment,
  appointmentslist,
  scheduleappointment,
  appointmentconfirmation,
  surveywebview,
} = Router
const { login, ...SecureRoutes } = Router

const defaultNavigationOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: '#fff' },
  headerTintColor: Color.tintColor,
  headerRight: props => <HeaderNavRight {...props} />,
  headerShown: true,
  headerTitle: props => <HeaderTitle {...props} />,
  headerBackTitleVisible: false,
  headerStyle: {
    elevation: 5,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: Color.white,
    shadowColor: Color.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  onTransitionEnd: () => {
    if (APIContext) {
      APIContext.store.dispatch({
        type: 'ON_TRANSITION_END',
        route: NavigationService.getCurrentRoute(),
      })
    }
  },
}

const AppStack = createStackNavigator(
  {
    ...SecureRoutes,
  },
  {
    defaultNavigationOptions,
    initialRouteName: 'dashboard',
  },
)

const AppointmentStack = createStackNavigator(
  {
    dashboard,
    appointment,
    appointmentslist,
    scheduleappointment,
    appointmentconfirmation,
    surveywebview,
    login,
  },
  {
    initialRouteName: 'dashboard',
    defaultNavigationOptions,
  },
)

const AuthStack = createStackNavigator({ login }, { headerMode: 'none' })

const RootStack = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: AppStack,
      Auth: AuthStack,
      Appointment: AppointmentStack,
    },
    {
      initialRouteName: 'AuthLoading',
      backBehavior: 'none',
    },
  ),
)

export const AppNavigator = () => {
  return <RootStack ref={NavigationService.setTopLevelNavigator} />
}
