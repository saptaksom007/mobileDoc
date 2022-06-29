import React, { PureComponent } from 'react'
import Alert from 'react-native-dropdownalert'
import { NavigationService } from 'navigation/NavigationService'
import { Env } from 'env'
import { Color } from 'constants/Color'
import * as styles from './DropdownAlert.styles'

class DropdownAlert extends PureComponent<{}> {
  render() {
    return (
      <Alert
        ref={alertRef => NavigationService.setAlert(alertRef)}
        warnColor={Color.warningBackground}
        errorColor={Color.errorBackground}
        infoColor={Color.noticeBackground}
        inactiveStatusBarBackgroundColor={Color[Env.environment]}
        defaultContainer={styles.container}
        titleStyle={styles.title}
        messageStyle={styles.message}
      />
    )
  }
}

export default DropdownAlert
