import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import i18n from 'ex-react-native-i18n'
import { Actions as NavAction } from 'navigation/SagaNavigation'

import { Linking } from 'react-native'
import { Action } from 'redux'
import { Medium } from 'components/CustomText/CustomText.component'

const cleanPhoneNumber = (value?: string) =>
  (value && value.split(' ').join('')) || ''

interface Props {
  value?: string
  dispatch?(action: Action): void
}

export class PhoneNumber extends PureComponent<Props> {
  phoneCall = () => {
    const { value, dispatch } = this.props
    const url = `tel:${cleanPhoneNumber(value)}`
    Linking.canOpenURL(url)
      .then((supported: any) => {
        if (!supported && dispatch) {
          dispatch(NavAction.showLocalError(i18n.t('error.default')))
        } else {
          return Linking.openURL(url)
        }
        return Promise.resolve()
      })
      .catch(() => {
        if (dispatch) {
          dispatch(NavAction.showLocalError(i18n.t('error.default')))
        }
      })
  }
  render() {
    const { value } = this.props
    return (
      <>
        <Medium
          style={{
            fontSize: 15,
            lineHeight: 30,
          }}
        >
          {'   '}
        </Medium>
        <Medium
          style={{
            textDecorationLine: 'underline',
            fontSize: 16,
            lineHeight: 35,
          }}
          onLongPress={this.phoneCall}
          onPress={this.phoneCall}
        >
          {cleanPhoneNumber(value)}
        </Medium>
      </>
    )
  }
}

function select(): any {
  return {}
}

export default connect(select)(PhoneNumber)
