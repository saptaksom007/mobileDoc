import React, { PureComponent } from 'react'
import { TouchableOpacity, View } from 'react-native'
import * as Updates from 'expo-updates'
import { Heading2, Medium } from 'components/CustomText/CustomText.component'
import i18n from 'ex-react-native-i18n'
import { Icon } from 'react-native-elements'
import { Color } from 'constants/Color'

import styles from './SampleError.styles'

export class SampleError extends PureComponent<any> {
  render() {
    return (
      <View style={styles.container}>
        <Icon name='error-outline' color={Color.errorBackground} size={50} />
        <Heading2 style={{ color: Color.errorBackground, textAlign: 'center' }}>
          {i18n.t('error.default')}
        </Heading2>
        <TouchableOpacity onPress={() => Updates.reloadAsync()}>
          <View>
            <Icon name='refresh' color={Color.darkText} size={30} />
            <Medium>{i18n.t('global.refresh')}</Medium>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
