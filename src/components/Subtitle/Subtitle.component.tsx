import React, { PureComponent } from 'react'

import { View } from 'react-native'
import { Heading3 } from 'components/CustomText/CustomText.component'
import { Icon } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'
import { Color } from 'constants/Color'
import { getTestId } from 'utilities/environment'

import styles, { SMALL_FONT } from './Subtitle.styles'

const testIdSubtitle = getTestId('header-subtitle')

interface Props {
  subtitle: string
  noTranslation: boolean
  noIcon: boolean
  smallTitle: boolean
}

class Subtitle extends PureComponent<Props> {
  static defaultProps = {
    subtitle: '-',
    noTranslation: false,
    noIcon: false,
    smallTitle: false
  }
  render() {
    const { subtitle, noTranslation, noIcon, smallTitle } = this.props
    return (
      <View style={[styles.container]}>
        <View
          style={styles.subtitle}
          testID={testIdSubtitle}
          accessibilityLabel={testIdSubtitle}
        >
          {!noIcon && subtitle !== i18n.missingTranslation() && (
            <Icon
              type={i18n.t(`${subtitle}_icon_type`)}
              name={i18n.t(`${subtitle}_icon`)}
              color={Color.tintColor}
              size={18}
            />
          )}
          <Heading3
            style={[
              styles.subtitleText,
              !noIcon && { marginLeft: 5 },
              smallTitle && { fontSize: SMALL_FONT }
            ]}
          >
            {noTranslation ? subtitle : i18n.t(subtitle)}
          </Heading3>
        </View>
      </View>
    )
  }
}

export default Subtitle
