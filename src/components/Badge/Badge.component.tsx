import * as React from 'react'

import { View, ViewStyle, TextStyle } from 'react-native'
import { Small } from 'components/CustomText/CustomText.component'
import styles from './Badge.styles'

interface Props {
  value?: string | number
  size?: number
  color?: string
  fontSize?: number
}

export const Badge = (props: Props) => {
  const { value, size, color, fontSize } = props
  // Empty badge =>
  if (!value || (typeof value === 'number' && value < 0)) {
    return (
      <View
        style={
          [
            styles.emptyBadge,
            size && { width: size, height: size },
          ] as ViewStyle
        }
      />
    )
  }
  return (
    <View
      style={
        [
          styles.badge,
          size && { width: size, height: size, borderRadius: size / 2 },
          color && { backgroundColor: color },
        ] as ViewStyle
      }
    >
      <Small style={[styles.badgeText, fontSize && { fontSize }] as TextStyle}>
        {String(value)}
      </Small>
    </View>
  )
}
