import 'config/i18n'
import 'config/api.config'
import 'moment/locale/de'
import 'dayjs/locale/de'

import { Logs } from 'expo'
import AppLoading from 'expo-app-loading'
import * as Updates from 'expo-updates'
import { Color } from './src/constants/Color'
import * as Sentry from 'sentry-expo'
import DropdownAlert from './src/components/DropdownAlert/DropdownAlert.component'
import { ErrorBoundary } from './src/components/ErrorBoundary'
import React, { Component } from 'react'
import pathOr from 'ramda/es/pathOr'
import { Provider } from 'react-redux'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import {
  StatusBar,
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
  YellowBox,
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { enableScreens } from 'react-native-screens'

import { AppNavigator } from './src/navigation'
import { SessionTimeoutModal } from './src/components/SessionTimeoutModal/SessionTimeoutModal.component'
import * as NotificationManager from './src/notifications'
import { configureStore } from './src/config/redux/store'
import { getVersionAsync, doesVersionMatch } from 'api/version'
import { APIContext } from 'api'
import { Env } from './src/env'
import { getTestId } from './src/utilities/environment'

import { TermsModal } from './src/components/TermsModal/TermsModal.component'
import { VersionMissMatch } from './src/components/VersionMissMatch/VersionMissMatch.component'
import { ActionTypes as DashboardActionTypes } from './src/screens/Dashboard/Dashboard.actions'

import { NoDoctorModal } from './src/components/NoDoctor'
import { Bootstrapper } from './src/components/Bootstrapper'
// @ts-ignore
import app from './app.json'
import { EventSubscription } from 'fbemitter'
import { LinkingManager } from 'components/LinkingManager'

enableScreens()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

interface State {
  appIsReady: boolean
  showMaintenance: boolean
  supportedVersion?: object
}

class App extends Component<{}, State> {
  state = {
    appIsReady: false,
    showMaintenance: false,
    supportedVersion: undefined,
  }

  componentDidMount() {
    this.notificationsListenener = NotificationManager.subscribe()
    AppState.addEventListener('change', this.handleAppStateChange)
    this.netInfoListenerUnsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange,
    )

    this.init()
  }

  componentWillUnmount() {
    NotificationManager.unsubscribe(this.notificationsListenener)
    AppState.removeEventListener('change', this.handleAppStateChange)
    this.netInfoListenerUnsubscribe()
    if (this.removeNewVersionListener) {
      this.removeNewVersionListener.remove()
    }
  }

  testIdMain = getTestId('main')

  async init() {
    this.store = await configureStore()
    APIContext.store = this.store
    const supportedVersion: any = await getVersionAsync()
    this.setState({ appIsReady: true, supportedVersion })
    this.removeNewVersionListener = Updates.addListener(this.newVersionListener)
    this.store.dispatch({
      type: DashboardActionTypes.NEW_APP_VERSION_REQUESTED,
    })
  }

  notificationsListenener: any
  netInfoListenerUnsubscribe: any
  store: any
  removeNewVersionListener?: EventSubscription

  handleAppStateChange = (currentAppState: AppStateStatus) => {
    if (this.store && this.store.dispatch) {
      this.store.dispatch({
        type: DashboardActionTypes.APP_STATE_CHANGE,
        currentAppState,
      })
    }
  }

  newVersionListener() {
    if (this.store && this.store.dispatch) {
      this.store.dispatch({
        type: DashboardActionTypes.NEW_APP_VERSION_REQUESTED,
      })
    }
  }

  handleConnectivityChange = (state: any) => {
    if (this.store && this.store.dispatch && state) {
      this.store.dispatch({
        type: DashboardActionTypes.CONNECTIVITY_CHANGE,
        payload: { isConnected: state.isConnected, connectionInfo: state.type },
      })
    }
  }

  render() {
    if (this.state.appIsReady) {
      if (!doesVersionMatch(this.state) && this.state.supportedVersion) {
        return (
          <VersionMissMatch supportedVersion={this.state.supportedVersion} />
        )
      }

      return (
        <ErrorBoundary>
          <View
            style={styles.container}
            testID={this.testIdMain}
            accessibilityLabel={this.testIdMain}
            collapsable={false}
          >
            <Provider store={this.store}>
              <ActionSheetProvider>
                <Bootstrapper>
                  {isReady => {
                    if (isReady) {
                      return (
                        <View style={styles.container}>
                          <AppNavigator />
                          <SessionTimeoutModal />
                          <TermsModal />
                          <DropdownAlert />
                          <NoDoctorModal />
                        </View>
                      )
                    }

                    return <AppLoading />
                  }}
                </Bootstrapper>
              </ActionSheetProvider>
              <LinkingManager />
            </Provider>

            <StatusBar
              backgroundColor={Color[Env.environment]}
              barStyle='dark-content'
              hidden={false}
              translucent={false}
            />
          </View>
        </ErrorBoundary>
      )
    }

    return <AppLoading />
  }
}

if (!__DEV__) {
  const publicDSN = pathOr('', ['expo', 'extra', 'sentry', 'publicDSN'])
  Sentry.init({ dsn: publicDSN(app) })
} else {
  // @ts-ignore
  global.__JEST__ = false
}

if (__DEV__) {
  // @ts-ignore
  const isRemoteDebuggingEnabled = typeof atob !== 'undefined'
  if (isRemoteDebuggingEnabled) {
    Logs.disableExpoCliLogging()
  } else {
    Logs.enableExpoCliLogging()
  }
}
console.disableYellowBox = true
YellowBox.ignoreWarnings(['Require cycle:'])

export default () => {
  return <App />
}
