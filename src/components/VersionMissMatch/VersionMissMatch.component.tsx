import i18n from 'ex-react-native-i18n'
import React from 'react'
import { Platform, View, Text, Linking, Button, Alert } from 'react-native'

import { Color } from 'constants/Color'
import styles from './VersionMissMatch.styles'
import { Small } from 'components/CustomText/CustomText.component'
import { getVersion } from 'utilities/version'

const showError = (link: string) =>
  Alert.alert(
    'Can not open the link to the app store: ' +
      `${link}. Please try to download the manually.`,
  )

const openLink = (link: string) => {
  Linking.canOpenURL(link).then(
    supported => {
      if (supported) {
        Linking.openURL(link)
      } else {
        showError(link)
      }
    },
    () => showError(link),
  )
}

export function VersionMissMatch(props: { supportedVersion: any }) {
  const link = props.supportedVersion[`latestUrl.${Platform.OS}`]
  return (
    <View style={styles.container} testID='versionMissMatch'>
      <Text style={styles.text} onPress={() => openLink(link)}>
        {i18n.t('error.outdatedApp')}
      </Text>
      <Button
        onPress={() => openLink(link)}
        color={Color.tintColor}
        title='Download'
        testID='downloadApp'
      />
      <Small style={styles.version}>{getVersion()}</Small>
    </View>
  )
}
