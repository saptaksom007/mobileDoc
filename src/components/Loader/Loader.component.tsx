import React, { PureComponent } from 'react'
import {
  ActivityIndicator,
  View,
  Platform,
  Image,
  ViewStyle,
} from 'react-native'

import { Color } from 'constants/Color'
import { getChannel } from 'utilities/channels'
import { Small } from 'components/CustomText/CustomText.component'
import { getVersion } from 'utilities/version'
import styles from './Loader.styles'

interface Props {
  containerProps?: { style: ViewStyle }
  loaderProps?: any
  withLogo?: boolean
  info?: string
  color?: string
}

export class Loader extends PureComponent<Props> {
  static defaultProps = {
    containerProps: {
      style: {},
    },
    withLogo: false,
    info: '',
  }
  render() {
    const { style, ...restContainerProps } = this.props.containerProps!
    const { withLogo, info, color } = this.props
    const channel = getChannel()
    return (
      <View style={[styles.container, style]} {...restContainerProps}>
        {withLogo && (
          <Image
            source={require('../../assets/images/icon_app.png')}
            style={styles.logo}
          />
        )}
        <ActivityIndicator
          animating
          size='large'
          color={
            color
              ? color
              : Platform.select({ ios: '#888', android: Color.tintColor })
          }
          {...this.props.loaderProps}
        />
        {channel !== 'production' &&
        channel !== 'stage' &&
        channel !== 'demo1' &&
        channel !== 'demo2' ? (
          <Small>{info}</Small>
        ) : null}
        {withLogo && <Small style={styles.version}>{getVersion()}</Small>}
      </View>
    )
  }
}
