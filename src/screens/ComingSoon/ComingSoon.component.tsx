import React, { Component } from 'react'

import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import styles from './ComingSoon.styles'
import { Action } from 'redux'
import { Text } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'

interface Props {
  dispatch(action: Action): void
}

export class ComingSoon extends Component<Props> {
  componentDidMount() {
    StatusBar.setHidden(false)
    StatusBar.setBarStyle('dark-content')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{i18n.t('comingSoon')}</Text>
      </View>
    )
  }
}

function select(): any {
  return {}
}

export default compose<Props, any>(connect(select))(ComingSoon)
