import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { StyleSheet, View, InteractionManager } from 'react-native'
import * as Progress from 'react-native-progress'
import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'

export const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  progress: {
    position: 'absolute',
    zIndex: 1001,
  },
})

interface Props {
  refreshing: boolean
}

interface State {
  timeout: boolean
}

export function withLoader(ComposedComponent: any) {
  class Enhance extends Component<Props, State> {
    state = {
      timeout: true,
    }

    componentDidMount() {
      this.mounted = true
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (this.mounted) {
            this.setState({ timeout: false })
          }
        }, 1000)
      })
    }
    componentWillUnmount() {
      this.mounted = false
    }
    mounted: boolean = false
    render() {
      const { refreshing } = this.props
      const { timeout } = this.state
      const showLoader = refreshing || timeout
      return (
        <View style={loaderStyles.container}>
          <ComposedComponent {...this.props} />
          {showLoader && (
            <Progress.Bar
              style={loaderStyles.progress}
              indeterminate
              height={5}
              borderRadius={0}
              width={Layout.window.width}
              borderWidth={0}
              color={Color.tintColor}
              useNativeDriver
            />
          )}
        </View>
      )
    }
  }
  hoistNonReactStatic(Enhance, ComposedComponent)
  return Enhance
}
