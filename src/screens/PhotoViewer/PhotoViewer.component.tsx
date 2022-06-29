import React, { Component } from 'react'

import { View, StatusBar } from 'react-native'
import TransformableImage from '@applications-developer/react-native-transformable-image'
import { BackButton } from 'components/BackButton/BackButton.component'
import { Layout } from 'constants/Layout'
import { connect } from 'react-redux'
import * as ScreenOrientation from 'expo-screen-orientation'
import { isIphoneX } from 'react-native-iphone-x-helper'

import Actions from './PhotoViewer.actions'
import styles from './PhotoViewer.styles'
import { Action } from 'redux'

import { Loader } from 'components/Loader/Loader.component'
import { Color } from 'constants/Color'

interface Props {
  dataUrl: string
  dispatch(action: Action): void
}

export class PhotoViewer extends Component<Props> {
  static navigationOptions = {
    headerShown: false,
  }

  async componentDidMount() {
    if (!isIphoneX()) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL)
    }
    StatusBar.setHidden(true)
  }

  async componentWillUnmount() {
    if (!isIphoneX()) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      )
    }
    StatusBar.setHidden(false)
  }

  render() {
    const { dataUrl, dispatch } = this.props
    return (
      <View style={styles.container}>
        {dataUrl ? (
          <TransformableImage
            source={{ uri: dataUrl }}
            style={styles.transformImageActive}
            enableScale
          />
        ) : (
          <Loader
            color={Color.white}
            containerProps={{ style: { backgroundColor: 'transparent' } }}
          />
        )}

        <BackButton
          onPress={() => dispatch(Actions.photoViewerPop())}
          visible
          color='#fff'
          containerStyle={{
            width: Layout.window.width / 12,
            height: Layout.window.height / 8,
          }}
        />
      </View>
    )
  }
}

function select(
  { photoviewer: { previews } }: any,
  {
    navigation: {
      state: {
        params: { uuid, url },
      },
    },
  }: any,
) {
  return { dataUrl: previews[uuid] ? previews[uuid].dataUrl : url }
}

export default connect(select)(PhotoViewer)
