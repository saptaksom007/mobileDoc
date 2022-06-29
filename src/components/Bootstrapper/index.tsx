import { PureComponent, ReactNode } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import Actions from 'screens/Login/Login.actions'

import { cacheAssetsAsync } from 'utilities/cacheAssetsAsync'
import { CustomFonts } from 'assets/fonts'
import i18n from 'ex-react-native-i18n'
import { initMediaCacheStorageAsync } from 'utilities/mediaCacheStorage'

import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons'
import { isStillLoggedAsync } from 'api/auth'
import { dispatchAsync } from 'utilities/dispatch.helpers'
import { getStorageItemDecrypted } from 'utilities/localStorage'
import { Tokens } from 'api/types'
import { TOKEN_KEY } from 'config/auth'

async function loadAssetsAsync() {
  try {
    await cacheAssetsAsync({
      fonts: [
        MaterialIcons.font,
        Ionicons.font,
        MaterialCommunityIcons.font,
        FontAwesome.font,
        ...CustomFonts,
      ],
      images: [
        require('assets/images/logo_docdok.png'),
        require('assets/images/icon_app.png'),
        require('../../../node_modules/react-native-dropdownalert/assets/error.png'),
        require('../../../node_modules/react-native-dropdownalert/assets/info.png'),
        require('../../../node_modules/react-native-dropdownalert/assets/success.png'),
        require('../../../node_modules/react-native-dropdownalert/assets/warn.png'),
        require('../../../node_modules/react-native-dropdownalert/assets/cancel.png'),
      ],
    })
  } catch (e) {
    console.warn('There was an error caching assets (see: App.js)', e)
  }
}

interface Props {
  appointmentLoaded?: boolean
  children(isReady: boolean): ReactNode
  dispatch(action: Action): void
}

interface State {
  isReady: boolean
  askedIsLogin: boolean
}

class BootstrapperDumb extends PureComponent<Props, State> {
  state = {
    isReady: false,
    askedIsLogin: false,
  }

  constructor(props: Props) {
    super(props)
    this.props.dispatch(Actions.getLimitedAccessTokenRequested())
  }

  async componentDidMount() {
    await i18n.initAsync()
    await initMediaCacheStorageAsync()
    await loadAssetsAsync()
    const isLogin = await isStillLoggedAsync()
    if (isLogin) {
      const tokenInfo: Tokens = JSON.parse(
        (await getStorageItemDecrypted(TOKEN_KEY)) || '{}',
      )
      this.props.dispatch(
        Actions.setIsLogin({ isLoggedIn: true, ...tokenInfo }),
      )
      await dispatchAsync(
        this.props.dispatch,
        Actions.initialLoadingRequested(),
      )
    } else {
      this.props.dispatch(Actions.setIsLogin({ isLoggedIn: false }))
    }

    this.setState({ askedIsLogin: true })
  }

  componentDidUpdate() {
    const { appointmentLoaded } = this.props
    const { askedIsLogin } = this.state

    if (appointmentLoaded && askedIsLogin) {
      this.setState({ isReady: appointmentLoaded })
    }
  }

  render() {
    const { isReady } = this.state
    const { children } = this.props

    return children(isReady)
  }
}

export const Bootstrapper = connect(
  ({ appointmentslist: { loaded: appointmentLoaded } }: any) => ({
    appointmentLoaded,
  }),
)(BootstrapperDumb)
