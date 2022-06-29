import React, { Component, ComponentType } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function withKeyboardAvoidingView(
  ComposedComponent: ComponentType<any>,
): ComponentType<any> {
  class Enhance extends Component<any> {
    render() {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
        >
          <ComposedComponent {...this.props} />
        </KeyboardAvoidingView>
      )
    }
  }
  hoistNonReactStatic(Enhance, ComposedComponent)
  return Enhance
}

export const withKeyboardAvoidingViewIf = (cond: boolean) =>
  cond
    ? withKeyboardAvoidingView
    : (ComposedComponent: ComponentType<any>) => ComposedComponent

export default withKeyboardAvoidingView
