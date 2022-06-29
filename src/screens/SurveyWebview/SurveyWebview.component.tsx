import React, { PureComponent } from 'react'
import { View, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { compose } from 'recompose'
import { NavigationScreenProp } from 'react-navigation'
import { WebView } from 'react-native-webview'
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import LoginActions from 'screens/Login/Login.actions'
import { Env } from 'env'
import { noop } from 'utilities/noop'
import styles from './SurveyWebview.styles'
import { dispatchAsync } from 'utilities/dispatch.helpers'

interface Props {
  dispatch(action: Action): void
  limitedAccessToken?: string
  navigation: NavigationScreenProp<{
    url: string
    patientId?: string
    goBack?: boolean
  }>
}

interface State {
  showLoader: boolean
}

export class SurveyWebview extends PureComponent<Props, State> {
  state = {
    showLoader: true,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatchAsync(dispatch, LoginActions.getLimitedAccessTokenRequested())
      .then(() => {})
      .catch(console.error)
  }

  onMessage = (event: WebViewMessageEvent) => {
    const {
      nativeEvent: { data: messageValue },
    } = event
    if (messageValue === Env.surveys.completedMatchMessage) {
      this.endSurvey()
    }
  }

  onNavigationStateChange = ({ url }: any) => {
    if (url.includes(Env.surveys.completedMatchMessage)) {
      this.setState({ showLoader: true })
      this.endSurvey()
    }
  }

  endSurvey = () => {
    const { dispatch, navigation } = this.props
    // SM2-240
    setTimeout(() => {
      if (navigation.getParam('goBack')) {
        dispatch(NavAction.pop())
      } else {
        const patientId = navigation.getParam('patientId')
        dispatch(NavAction.immediatelyResetStack(['dashboard']))
        dispatch(NavAction.push('survey', { patientId }))
      }
    }, 5000)
  }

  render() {
    const isAndroid = Platform.OS === 'android'
    const url = this.props.navigation.getParam('url')
    const { limitedAccessToken } = this.props
    const uri = `${url}?token=${limitedAccessToken}`
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={this.onMessage}
          onNavigationStateChange={Platform.select({
            ios: this.onNavigationStateChange,
            android: noop,
          })}
          scalesPageToFit={isAndroid ? false : undefined}
          mixedContentMode={isAndroid ? 'always' : undefined}
          thirdPartyCookiesEnabled
          originWhitelist={['*']}
        />
      </View>
    )
  }
}

function select({ login: { limitedAccessToken } }: any): any {
  return { limitedAccessToken }
}

export default compose<Props, any>(connect(select))(SurveyWebview)
