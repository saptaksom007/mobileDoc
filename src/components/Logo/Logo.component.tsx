import React, { PureComponent } from 'react'
import { View, Image } from 'react-native'
import styles from './Logo.styles'

interface Props {
  height: number
}

class Logo extends PureComponent<Props> {
  render() {
    const { height } = this.props
    return (
      <View style={styles.container}>
        <Image
          style={[
            styles.logoImg,
            {
              height: height / 2,
            },
          ]}
          source={require('../../assets/images/logo_docdok.png')}
        />
      </View>
    )
  }
}

export default Logo
