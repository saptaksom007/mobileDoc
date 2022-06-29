import React, { PureComponent } from 'react'

import { connect } from 'react-redux'
import i18n from 'ex-react-native-i18n'
import { GenericModal } from 'components/GenericModal/GenericModal.component'
import { Action } from 'redux'

interface Props {
  dispatch(action: Action): void
  visible?: boolean
}

class SessionTimeoutModalBase extends PureComponent<Props> {
  render() {
    const { dispatch, visible } = this.props
    return (
      <GenericModal
        visible={visible}
        title={i18n.t('alert.sessionHasExpired.title')}
        body={i18n.t('alert.sessionHasExpired.body')}
        titleOnPress={i18n.t('alert.sessionHasExpired.button')}
        iconName={'timer-off'}
        onPress={() => dispatch({ type: 'RELOGIN_REQUESTED' })}
      />
    )
  }
}

function select({ login: { sessionHasExpired, isLoggedIn } }: any) {
  return { visible: sessionHasExpired && isLoggedIn }
}

export const SessionTimeoutModal = connect(select)(SessionTimeoutModalBase)
