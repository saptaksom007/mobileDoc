import React, { Component } from 'react'
import { View, StyleSheet, Platform, CheckBox } from 'react-native'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'ex-react-native-i18n'
import { Button, Icon, CheckBox as IOSCheckBox } from 'react-native-elements'
import { Color } from 'constants/Color'
import { GenericModal } from 'components/GenericModal/GenericModal.component'
import { HeaderTitle } from 'components/HeaderTitle/HeaderTitle.component'
import { Small } from 'components/CustomText/CustomText.component'
import { getTermsDE, getTermsEN } from 'utilities/terms'
import DashboardActions from 'screens/Dashboard/Dashboard.actions'
import { userActions } from 'common-docdok/lib/domain/user/actions'
import { getTestId } from 'utilities/environment'
import CustomTextStyles, {
  fontFamily,
} from 'components/CustomText/CustomText.styles'
import styles, { getHeaderHeightWhenChanged } from './TermsModal.styles'
import { Loader } from '../Loader/Loader.component'
import { Action } from 'redux'

interface Props {
  visible: boolean
  dispatch(action: Action): void
  agreeTerm: boolean
  termsVersion: string
  acceptedTermsVersion: string
  isSwiss: boolean
}

interface State {
  section?: string
  checked: boolean
}

class TermsModalBase extends Component<Props, State> {
  static defaultProps = {
    visible: false,
  }

  state = { section: undefined, checked: false }

  clearStorage = true
  testIdAgree = getTestId('agree_btn')
  testIdDecline = getTestId('decline_btn')
  testIdCloseTerms = getTestId('close-term-button')
  testIdCheckbox = getTestId('checkbox_terms')
  renderAgreeButton = ({ dispatch, termsVersion, isSwiss }: Partial<Props>) => (
    <View style={styles.agreeContainer}>
      {!isSwiss && (
        <Small style={styles.consent}>
          {i18n.t('terms.consent')}{' '}
          <Small
            onPress={() =>
              this.setState((prevState: any) => ({
                section: prevState.section ? undefined : 'privacy-policy',
              }))
            }
            style={styles.consentLink}
          >
            {i18n.t('terms.consentLink')}
          </Small>
        </Small>
      )}
      <View
        accessibilityLabel={this.testIdCheckbox}
        testID={this.testIdCheckbox}
      >
        {Platform.select({
          ios: (
            <IOSCheckBox
              title={i18n.t('terms.checkboxLabel')}
              checked={this.state.checked}
              onPress={() => this.setState({ checked: !this.state.checked })}
              textStyle={[CustomTextStyles.font, CustomTextStyles.small]}
              containerStyle={styles.checkboxContainer}
              checkedColor={Color.tintColor}
              fontFamily={fontFamily}
            />
          ),
          android: (
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <CheckBox
                value={this.state.checked}
                onValueChange={(checked: boolean) => this.setState({ checked })}
              />
              <View
                style={{
                  maxWidth: 270,
                }}
              >
                <Small numberOfLines={3}>{i18n.t('terms.checkboxLabel')}</Small>
              </View>
            </View>
          ),
        })}
      </View>
      <View style={styles.agreeButtonContainer}>
        <View
          accessibilityLabel={this.testIdDecline}
          testID={this.testIdDecline}
        >
          <Small
            onPress={() =>
              dispatch!(DashboardActions.logOutRequested(this.clearStorage))
            }
            style={[styles.button, styles.declineText]}
          >
            {i18n.t('terms.decline')}
          </Small>
        </View>
        <View accessibilityLabel={this.testIdAgree} testID={this.testIdAgree}>
          <Button
            backgroundColor={!this.state.checked ? '#D1D5D8' : Color.tintColor}
            onPress={() =>
              this.state.checked
                ? dispatch!(
                    userActions.updateTermsVersionRequested(termsVersion),
                  )
                : alert(i18n.t('terms.checkboxAlert'))
            }
            buttonStyle={styles.button}
            title={i18n.t('terms.agree')}
          />
        </View>
      </View>
    </View>
  )

  renderCloseButton = ({ dispatch }: Partial<Props>) => (
    <Button
      backgroundColor={Color.tintColor}
      onPress={() => dispatch!(DashboardActions.hideTerms())}
      buttonStyle={styles.button}
      title={i18n.t('terms.close')}
      testID={this.testIdCloseTerms}
      accessibilityLabel={this.testIdCloseTerms}
    />
  )

  renderModalContent = () => {
    const { agreeTerm, termsVersion, acceptedTermsVersion } = this.props
    const { section } = this.state
    const uri =
      i18n.getFallbackLocale() === 'de'
        ? getTermsDE(termsVersion)
        : getTermsEN(termsVersion)

    const termsChanged = !agreeTerm && acceptedTermsVersion
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            !termsChanged && { height: getHeaderHeightWhenChanged() },
          ]}
        >
          <HeaderTitle constainerStyle={styles.headerTitle} />
          {termsChanged && (
            <View style={styles.changeContainer}>
              <Icon
                name='asterisk'
                type='material-community'
                size={12}
                color={Color.warningText}
              />
              <Small style={styles.change}> {i18n.t('terms.changed')}</Small>
            </View>
          )}
        </View>
        <LinearGradient
          style={[
            styles.linearGradient,
            !termsChanged && { top: getHeaderHeightWhenChanged() },
          ]}
          colors={['rgba(0,0,0,0.3)', 'transparent']}
        />

        <WebView
          source={{ uri: `${uri}${section ? `#${section}` : ''}` }}
          renderLoading={() => (
            <Loader
              containerProps={{
                style: StyleSheet.absoluteFillObject,
              }}
            />
          )}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode={'always'}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={[styles.buttonsContainer, agreeTerm && styles.closeButton]}
        >
          {agreeTerm
            ? this.renderCloseButton(this.props)
            : this.renderAgreeButton(this.props)}
        </View>
      </View>
    )
  }

  render() {
    const { visible } = this.props
    return (
      <GenericModal
        visible={visible}
        renderModal={this.renderModalContent}
        extraData={this.state}
      />
    )
  }
}

const select = ({
  login: { isLoggedIn, hasLimitedAccessTokenError },
  profile,
  dashboard: { agreeTerm, showTerms, termsVersion },
}: any) => {
  const SWISS_ORIGIN = ['SALUTA', 'MIGROS']
  let agreedTerm = agreeTerm
  let termsVersionIs = termsVersion
  if (SWISS_ORIGIN.includes(profile?.origin)) {
    termsVersionIs = '2021-11-19'
    agreedTerm = profile?.acceptedTermsVersion === termsVersionIs
  }
  return {
    visible:
      (isLoggedIn &&
        !agreedTerm &&
        !!termsVersion &&
        !hasLimitedAccessTokenError) ||
      showTerms,
    agreeTerm: agreedTerm,
    termsVersion:
      termsVersionIs ||
      (isLoggedIn && profile ? profile.acceptedTermsVersion : ''),
    acceptedTermsVersion: profile && profile.acceptedTermsVersion,
    isSwiss: SWISS_ORIGIN.includes(profile?.origin),
  }
}

export const TermsModal = connect(select)(TermsModalBase)
