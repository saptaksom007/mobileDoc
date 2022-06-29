import React, { Component } from 'react'
import { KeyboardTypeOptions, TextInput, View, Text } from 'react-native'

import styles from './AppTextInput.styles'

interface Props {
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  leftIcon?: any
  style?: any
  containerStyle?: any
  onChangeText(text: string): void
  error?: string
  value?: string
  showLabel?: boolean
  icon?: any
}

export class AppTextInput extends Component<Props> {
  static defaultProps = {
    placeholder: 'default',
    value: '',
    showLabel: true,
  }

  render() {
    const {
      placeholder,
      style,
      containerStyle,
      onChangeText,
      keyboardType,
      error,
      value,
      showLabel,
      icon,
    } = this.props
    return (
      <View>
        {showLabel && <Text style={styles.label}>{placeholder}</Text>}
        <View style={[styles.container, containerStyle]}>
          {icon}
          <TextInput
            keyboardType={keyboardType}
            placeholder={placeholder}
            style={[styles.input, style]}
            onChangeText={onChangeText}
            value={value}
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    )
  }
}
