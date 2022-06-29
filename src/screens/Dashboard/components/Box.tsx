import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import TouchableNativeFeedbackSafe from '@expo/react-native-touchable-native-feedback-safe'
import { Icon } from 'react-native-elements'
import i18n from 'ex-react-native-i18n'
import { Heading2 } from 'components/CustomText/CustomText.component'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import DashboardActions from 'screens/Dashboard/Dashboard.actions'
import { Color } from 'constants/Color'
import { Badge } from 'components/Badge/Badge.component'

import styles, { ICON_SIZE, ICON_SIZE_SMALL } from '../Dashboard.styles'
import { Action } from 'redux'
import { UserOrigins } from 'constants/UserOrigins'

function onPressBox(nextRoute: any, dispatch: any, locked: any) {
  if (nextRoute) {
    if (locked) {
      dispatch(DashboardActions.loginWithNextRouteRequested(nextRoute))
    } else {
      dispatch(nextRoute)
    }
  } else {
    dispatch(NavAction.showLocalWarning(i18n.t('alert.notImplemented')))
  }
}

interface Props {
  name: string
  badgeNumber?: number
  nextRoute(): void
  dispatch?(action: Action): void
  locked?: boolean
  testID?: string
  origin?: string
  color: string
}

const Box = ({
  name,
  badgeNumber,
  nextRoute,
  dispatch,
  locked,
  testID,
  origin,
  color,
}: Props) => {
  const isMigros = false && origin === UserOrigins.MIGROS

  let titleKey = `dashboard.box.${name}.title`
  if (isMigros) {
    titleKey = `dashboard.box.${name}.${UserOrigins.MIGROS}.title`
  }
  return (
    <TouchableNativeFeedbackSafe
      onPress={() => onPressBox(nextRoute(), dispatch, locked)}
      activeOpacity={0.7}
    >
      <View style={styles.boxParentContainer}>
        <View
          style={[
            styles.boxContainer,
            { backgroundColor: color } as StyleProp<ViewStyle>,
          ]}
          testID={testID}
          accessibilityLabel={testID}
        >
          <View style={styles.boxIcon}>
            <Icon
              name={name === 'officehours' ? 'event' : name}
              size={ICON_SIZE}
              color={Color.white}
            />
          </View>
          {badgeNumber ? (
            <View style={styles.badgeView}>
              <Badge value={badgeNumber} />
            </View>
          ) : null}
          {locked && (
            <Icon
              name={'lock'}
              size={ICON_SIZE_SMALL}
              color={Color.warningBackground}
            />
          )}
        </View>
        <Heading2 style={styles.boxTitle}>{i18n.t(titleKey)}</Heading2>
      </View>
    </TouchableNativeFeedbackSafe>
  )
}

Box.defaultProps = {
  name: 'chat',
  badgeNumber: 0,
  locked: false,
  origin: '',
}

function select(): any {
  return {}
}

export default connect(select)(Box)
