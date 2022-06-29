import React, { Component } from 'react'

import { SafeImage } from 'react-native-safe-image'
import { View } from 'react-native'
import { Badge } from 'components/Badge/Badge.component'
import { parseName } from 'utilities/parseName'

import styles, { colors, DEFAULT_SIZE } from './Avatar.styles'

interface Props {
  name: string
  size: number
  style?: any
  url?: string
}

export class Avatar extends Component<Props> {
  static defaultProps = {
    size: DEFAULT_SIZE,
    name: 'default',
  }

  render() {
    const { name, style, size, url: uri } = this.props
    return (
      <SafeImage
        key={uri}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        source={{ uri }}
        fallbackComponent={
          <View
            style={[
              styles.container,
              style,
              size && { width: size, height: size },
            ]}
          >
            <Badge
              value={`${(parseName(name).firstName || 'avatar')
                .substr(0, 1)
                .toUpperCase()}`}
              size={size}
              color={`${colors[(name.codePointAt(0) || 1) % colors.length]}`}
            />
          </View>
        }
      />
    )
  }
}
