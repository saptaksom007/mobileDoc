

import React, { PureComponent } from 'react'
import i18n from 'ex-react-native-i18n'

import { Bold, Medium } from 'components/CustomText/CustomText.component'
import PhoneNumber from 'components/PhoneNumber/PhoneNumber.component'

import styles from './Clinic.styles'

interface Props {
  name: string,
  contact: string,
  street: string,
  location: string
}

class Clinic extends PureComponent<Props> {
  render() {
    const { name, contact, street, location } = this.props
    return (
      <Medium style={styles.container}>
        <Bold>{i18n.t('clinic.name')}:</Bold> {name}
        {'\n'}
        <Bold>{i18n.t('clinic.address')}:</Bold> {street}
        {', '}
        {location}
        {'\n'}
        <Bold>{i18n.t('clinic.phone')}:</Bold> <PhoneNumber value={contact} />
        {'\n'}
      </Medium>
    )
  }
}

export default Clinic
