import React, { PureComponent } from 'react'
import { Text as RNText, TextProps, StyleProp, TextStyle } from 'react-native'

import styles from './CustomText.styles'

const ReactText = (textProps: TextProps) => (
  <RNText
    {...{ ...textProps, allowFontScaling: false, ellipsizeMode: 'tail' }}
  />
)

export class Text extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Bold extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.bold, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Heading1 extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.h1, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Heading2 extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.h2, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Heading3 extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.h3, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Paragraph extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.p, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Small extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.small, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}

export class Medium extends PureComponent<TextProps> {
  render() {
    const { style, ...props } = this.props
    return (
      <ReactText
        style={[styles.font, styles.medium, style] as StyleProp<TextStyle>}
        {...props}
      />
    )
  }
}
