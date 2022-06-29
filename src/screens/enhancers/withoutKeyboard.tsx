import React, { Component, ComponentType } from 'react'
import { Keyboard } from 'react-native'
import hoistNonReactStatic from 'hoist-non-react-statics'

function withoutKeyboard(ComposedComponent: ComponentType<any>) {
  class WithoutKeyboardComponent extends Component {
    componentDidMount() {
      Keyboard.dismiss()
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }
  hoistNonReactStatic(WithoutKeyboardComponent, ComposedComponent)
  return WithoutKeyboardComponent
}

export default withoutKeyboard
