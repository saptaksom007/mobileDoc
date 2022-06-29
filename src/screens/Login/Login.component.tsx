import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import { Keyboard, View, StyleSheet, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Constants from 'expo-constants'

import { withKeyboardAvoidingViewIf } from 'screens/enhancers/withKeyboardAvoidingView'
import KeycloakUtil from 'utilities/keycloak'
import { BackButton } from 'components/BackButton/BackButton.component'
import { Loader } from 'components/Loader/Loader.component'
import { Env } from 'env'

import Actions from './Login.actions'
import styles from './Login.styles'
import { Action } from 'redux'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import { readable } from 'common-docdok/lib/utils/crypto'
import { getRememberMeAsync } from 'api/user'

export const e2eJsToInject = () =>
  `document.getElementById("username").value = '${
    Env.e2e ? (Env.e2e as any).config.login : ''
  }';` +
  `document.getElementById("password").value = '${
    Env.e2e ? (Env.e2e as any).config.password : ''
  }';` +
  'setTimeout(function(){ document.getElementById("kc-login").click()}, 2500);'

function injectedJavaScript(rememberMeEmail?: string) {
  const removeLang = 'document.querySelector(".lang-selection").remove();'
  const removeShadow =
    'document.querySelector(".main")' +
    '.setAttribute("style", "box-shadow: none;");'
  const resizeLogo =
    'document.querySelector(".spacer + div > img")' +
    '.setAttribute("width", "133");'
  const showLogo =
    'document.querySelector(".spacer + div.logo")' +
    '.setAttribute("style", "visibility: visible");'
  const removeSpacer = 'document.querySelector(".spacer").remove();'
  const blurInput =
    'var blurPwd = ' +
    'function(){ document.getElementById("password").blur(); };'
  const onSubmit =
    'document.getElementById("kc-form-login")' +
    '.addEventListener("submit", blurPwd);'

  return (
    removeLang +
    removeShadow +
    resizeLogo +
    showLogo +
    removeSpacer.repeat(2) +
    blurInput +
    onSubmit +
    (rememberMeEmail
      ? `document.getElementById("username").value = '${rememberMeEmail}';`
      : '') +
    (!Constants.isDevice && Env.e2e ? e2eJsToInject() : '')
  )
}

interface Props {
  dispatch(action: Action): void
}

interface State {
  raceCondition: boolean
  showBackButton: boolean
  rememberMeEmail?: string | null
  loginUrl: string
}

export class Login extends Component<Props, State> {
  state = {
    raceCondition: false,
    showBackButton: false,
    rememberMeEmail: undefined,
    loginUrl: KeycloakUtil.getLoginURL(),
  }

  componentDidMount() {
    StatusBar.setHidden(true)
    this.remember()
  }

  componentWillUnmount() {
    StatusBar.setHidden(false)
  }

  onNavigationStateChange = ({ url, loading }: WebViewNavigation) => {
    const { dispatch } = this.props
    const { raceCondition } = this.state
    if (KeycloakUtil.matchAuthURL(url) && loading && !raceCondition) {
      Keyboard.dismiss()
      dispatch(Actions.loginRequested(url))
      this.setState({ raceCondition: true, showBackButton: false })
    }
  }

  onLoadEnd = (event: any) => {
    const { url, canGoBack } = event.nativeEvent
    const { loginUrl } = this.state
    this.setState({ showBackButton: url !== loginUrl && canGoBack })
  }

  async remember(): Promise<any> {
    const rememberMeEmailEncrypt = await getRememberMeAsync()
    const rememberMeEmail = readable(rememberMeEmailEncrypt!)
    this.setState({ rememberMeEmail })
  }

  WEBVIEW_REF: any = undefined

  render() {
    const {
      rememberMeEmail,
      showBackButton,
      loginUrl,
      raceCondition,
    } = this.state
    if (raceCondition) {
      return <Loader withLogo info={'Login Race Condition'} />
    }
    return (
      <View style={styles.container} testID='login'>
        <WebView
          ref={ref => (this.WEBVIEW_REF = ref)}
          source={{
            uri: loginUrl,
          }}
          renderLoading={() => (
            <Loader
              withLogo
              info={'Login WebView'}
              containerProps={{
                style: StyleSheet.absoluteFillObject,
              }}
            />
          )}
          startInLoadingState
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadEnd={this.onLoadEnd}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScript={injectedJavaScript(rememberMeEmail)}
          mixedContentMode={'always'}
          sharedCookiesEnabled
        />
        <BackButton
          onPress={() => {
            this.WEBVIEW_REF.goBack()
            this.setState({ showBackButton: false })
          }}
          visible={showBackButton}
        />
      </View>
    )
  }
}

function select({ login: { error } }: any) {
  return { error }
}

export default compose<Props, any>(
  withKeyboardAvoidingViewIf(Platform.OS === 'android'),
  connect(select),
)(Login)
