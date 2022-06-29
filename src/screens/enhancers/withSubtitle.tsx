import React, { PureComponent, ComponentType } from 'react'
import { View, StyleSheet } from 'react-native'
import Subtitle from 'components/Subtitle/Subtitle.component'

import hoistNonReactStatic from 'hoist-non-react-statics'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

const withSubtitle = (subtitle: string) => (
  ComposedComponent: ComponentType<any>
) => {
  class WithSubtitleComponent extends PureComponent<any> {
    render() {
      return (
        <View style={styles.container}>
          {subtitle && <Subtitle subtitle={subtitle} />}
          <ComposedComponent {...this.props} />
        </View>
      )
    }
  }
  hoistNonReactStatic(WithSubtitleComponent, ComposedComponent)
  return WithSubtitleComponent
}

export default withSubtitle
