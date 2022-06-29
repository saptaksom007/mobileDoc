import * as React from 'react'
import { StackHeaderTitleProps } from 'react-navigation-stack'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { connect } from 'react-redux'
import Logo from 'components/Logo/Logo.component'
import { View, ViewStyle, StyleProp } from 'react-native'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'
import { getTestId } from 'utilities/environment'
import styles from './HeaderTitle.styles'
import { Dispatch } from 'redux'
import { identity } from 'ramda'
import { useCallbackOne } from 'use-memo-one'

const testId = getTestId('header-logo')

function HeaderTitleBase(
  props: Partial<StackHeaderTitleProps> & {
    dispatch: Dispatch
    constainerStyle?: StyleProp<ViewStyle>
  },
) {
  const { dispatch, constainerStyle } = props
  const goHome = useCallbackOne(() => dispatch(NavAction.popToTop()), [])
  return (
    <View
      style={[styles.container, constainerStyle]}
      testID={testId}
      accessibilityLabel={testId}
    >
      <TouchableNativeFeedbackSafe onPress={goHome}>
        <Logo height={120} />
      </TouchableNativeFeedbackSafe>
    </View>
  )
}

export const HeaderTitle = connect(identity)(HeaderTitleBase)
