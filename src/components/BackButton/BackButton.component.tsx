import React from 'react'

import { Color } from 'constants/Color'
import { Layout } from 'constants/Layout'
import { Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { NavigationScreenProp } from 'react-navigation'
import { StackHeaderLeftButtonProps } from 'react-navigation-stack'

export const ICON_SIZE: number = Layout.window.height * 0.05

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Layout.window.width / 5,
    height: Layout.window.height / 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props extends StackHeaderLeftButtonProps {
  navigation?: NavigationScreenProp<any>
  visible?: boolean
  onPress?(): void
  color?: string
  containerStyle?: any
}

export function BackButton({
  visible,
  onPress,
  color,
  containerStyle,
  navigation,
}: Props) {
  if (!visible) {
    return null
  }
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => {
        if (navigation) {
          navigation.goBack()
        }
        if (onPress) {
          onPress()
        }
      }}
    >
      <Icon
        type={Platform.OS === 'ios' ? 'ionicon' : 'material'}
        name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'arrow-back'}
        size={ICON_SIZE}
        color={color || Color.tintColor}
      />
    </TouchableOpacity>
  )
}
