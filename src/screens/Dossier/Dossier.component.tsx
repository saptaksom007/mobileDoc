import React, { PureComponent } from 'react'
import { compose } from 'recompose'

import { connect } from 'react-redux'
import Conversation from 'components/Conversation/Conversation.component'
import ListContainer from 'components/ListContainer/ListContainer.component'
import { getTestId } from 'utilities/environment'
import i18n from 'ex-react-native-i18n'
import withSubtitle from 'screens/enhancers/withSubtitle'
import { momentWithLocales, getCalendarOutputFormat } from 'utilities/date'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { Action } from 'redux'

const testId = getTestId('dossiers')

interface Props {
  dispatch(action: Action): void
  patients: any[]
}

export class Dossier extends PureComponent<Props> {
  formatDate = (date: Date) =>
    momentWithLocales(date).calendar(undefined, getCalendarOutputFormat())

  renderRow = ({ item: patient }: any) => (
    <Conversation
      avatarUrl={patient.avatarPicture}
      title={`${patient.firstName} ${patient.lastName}`}
      content={`${i18n.t('dossier.birthday')}: ${this.formatDate(
        patient.birthdate,
      )}`}
      onPress={() =>
        this.props.dispatch(
          NavAction.push('dossierdetail', { patientId: patient.uuid }),
        )
      }
      iconName={
        patient.gender && patient.gender !== 'DIVERS'
          ? `md-${patient.gender && patient.gender.toLowerCase()}`
          : undefined
      }
      iconType='ionicon'
    />
  )

  render() {
    return (
      <ListContainer
        testID={testId}
        data={this.props.patients}
        renderItem={this.renderRow}
      />
    )
  }
}

function select({ healthrelationCache: { patients } }: any) {
  return {
    patients: Object.values(patients),
  }
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('dossier.subtitle'),
)(Dossier)
