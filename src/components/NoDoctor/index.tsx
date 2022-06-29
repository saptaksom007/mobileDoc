import React from 'react'
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { Heading2, Medium } from 'components/CustomText/CustomText.component'
import i18n from 'ex-react-native-i18n'
import { Icon } from 'react-native-elements'
import { Color } from 'constants/Color'
import { Env } from 'env'
import { GenericModal } from 'components/GenericModal/GenericModal.component'
import { clearStorageAsync } from 'utilities/localStorage'
import * as Updates from 'expo-updates'
import { fontFamilyBold } from 'components/CustomText/CustomText.styles'
import { getRememberMeAsync } from 'api/user'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: Platform.select({ ios: 35, android: 25 }),
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 15,
  },
  link: {
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
    fontFamily: fontFamilyBold,
  },
  textContainer: {
    marginTop: 50,
    flex: 1,
    justifyContent: 'space-around',
  },
})

const resetAndReload = async () => {
  await clearStorageAsync()
  Updates.reloadAsync()
}

const resetAndGoToWebAsync = async () => {
  const email = await getRememberMeAsync()
  await clearStorageAsync()
  await Linking.openURL(`${Env.api.base}/?email=${email}`)
}

interface Props {
  isLimitedAccessTokenError: boolean
}

const NoDoctor = (props: Props) => (
  <GenericModal
    visible={props.isLimitedAccessTokenError}
    renderModal={() => (
      <View style={styles.container}>
        <Icon name='error-outline' color={Color.warningBackground} size={50} />
        <Heading2
          style={{
            color: Color.warningBackground,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          {i18n.t('error.default')}
        </Heading2>
        <View style={styles.textContainer}>
          <Medium style={styles.text}>{i18n.t('error.noDoctor.intro')}</Medium>
          {Platform.OS === 'android' && (
            <>
              <Medium style={styles.text}>{'\n'}</Medium>
              <Medium style={styles.text}>
                {i18n.t('error.noDoctor.android')}
              </Medium>
              <Medium style={styles.text}>{'\n'}</Medium>
            </>
          )}
          {Platform.OS === 'ios' && (
            <>
              <Medium style={styles.text}>{'\n'}</Medium>
              <Medium style={styles.text}>
                {i18n.t('error.noDoctor.ios')}
              </Medium>
              <Medium style={styles.text}>{'\n'}</Medium>
            </>
          )}
          <Medium style={styles.text}>
            {i18n.t('error.noDoctor.beforeLink')}
          </Medium>
          <TouchableOpacity onPress={resetAndGoToWebAsync}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <Icon
                name='chevron-right'
                type='material'
                color={Color.darkText}
                size={25}
              />
              <Medium style={styles.link}>{Env.api.base}</Medium>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetAndReload} style={{ padding: 10 }}>
            <View>
              <Medium style={{ textAlign: 'center' }}>
                {i18n.t('global.refresh')}
              </Medium>
              <Icon name='refresh' color={Color.darkText} size={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )}
    extraData={props}
  />
)
const select = ({ login: { isLimitedAccessTokenError } }: any) => ({
  isLimitedAccessTokenError,
})

export const NoDoctorModal = connect(select)(NoDoctor)
