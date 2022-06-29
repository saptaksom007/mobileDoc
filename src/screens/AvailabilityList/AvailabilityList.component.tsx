import React, { PureComponent } from 'react'
import { compose } from 'recompose'
import { FlatList } from 'react-native'
import i18n from 'ex-react-native-i18n'

import EmptyList from 'components/EmptyList/EmptyList.component'
import { connect } from 'react-redux'
import Conversation from 'components/Conversation/Conversation.component'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { getClinicsFromAvailabilities } from 'common-docdok/lib/domain/healthrelation/selectors/findClinic'
import withSubtitle from 'screens/enhancers/withSubtitle'
import { isInteger } from 'utilities/number'

import styles from './AvailabilityList.styles'
import { Action } from 'redux'

const getClinicMessage = (item: {
  doctorMessage: string
  clinicMessage: string | number
}) => {
  if (!item.clinicMessage) {
    return item.doctorMessage
  }
  return isInteger(item.clinicMessage)
    ? i18n.t('availabilitydetail.card.clinicMessage', {
      hours: item.clinicMessage
    })
    : (item.clinicMessage as string)
}

interface Props {
  dispatch(action: Action): void
  clinics: any[]
}

export class AvailabilityList extends PureComponent<Props> {
  renderRow = ({ item }: any) => (
    <Conversation
      title={item.clinicName}
      onPress={() =>
        this.props.dispatch(NavAction.push('availabilitydetail', { ...item }))
      }
      content={getClinicMessage(item)}
      hideAvatar
      hideChevron={false}
      detailNumberOfLines={4}
      iconName={'access-time'}
    />
  )

  render() {
    const { clinics } = this.props

    if (!clinics || clinics.length === 0) {
      return <EmptyList show />
    }

    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={clinics}
        renderItem={this.renderRow}
        keyExtractor={(_item, index) => `avail-${index}`}
      />
    )
  }
}

function select({ healthrelation: { availabilities } }: any) {
  const clinics = getClinicsFromAvailabilities(availabilities) || []
  return { clinics }
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('availabilityList.subtitle')
)(AvailabilityList)
