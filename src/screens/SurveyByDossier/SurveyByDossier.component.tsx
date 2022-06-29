import React, { Component } from 'react'

import i18n from 'ex-react-native-i18n'
import { getTestId } from 'utilities/environment'
import { connect } from 'react-redux'
import Conversation from 'components/Conversation/Conversation.component'
import ListContainer from 'components/ListContainer/ListContainer.component'
import withSubtitle from 'screens/enhancers/withSubtitle'
import { compose } from 'recompose'
import {
  compose as Rcompose,
  sortWith,
  descend,
  prop,
  head,
  map,
  curry
} from 'ramda'

import { Actions as NavAction } from 'navigation/SagaNavigation'

import {
  getNumberOfIncompleteSurveyByPatient,
  getNumberOfSurveyByPatient,
  filterPatient,
  filterIncomplete
} from 'common-docdok/lib/domain/survey/selectors/incompleteSurveys'
import { Action } from 'redux'

interface Props {
  dispatch(action: Action): void
  mySurveys: any[]
  patients: any[]
}

const getLastCreationDate = (patient: any, mySurveys: any) =>
  Rcompose(
    // @ts-ignore
    prop('creationDate'),
    head,
    sortWith([descend(prop('creationDate'))]),
    filterIncomplete,
    filterPatient(patient)
  )(mySurveys)

const addMostRecentSurveyDate = curry((mySurveys: any[], patient: any) => ({
  ...patient,
  mostRecentSurveyDate: getLastCreationDate(patient, mySurveys)
}))

const getPatientsWithLastSurveyDate = (patients: any[], mySurveys: any[]) =>
  Rcompose(
    sortWith([descend(prop('mostRecentSurveyDate'))]),
    map(addMostRecentSurveyDate(mySurveys))
  )(patients)

const testId = getTestId('surveybydossier')

export class SurveyByDossier extends Component<Props> {
  getItemContent = (totalSurveys: number, inconpletSurveys: number) =>
    `${i18n.t('surveys.survey', {
      count: totalSurveys
    })}, ${i18n.t('surveys.incomplete', {
      count: inconpletSurveys
    })}`

  renderRow = ({ item: patient }: any) => {
    const { mySurveys } = this.props
    const incompleteSurveys: number = getNumberOfIncompleteSurveyByPatient(
      patient,
      mySurveys
    )
    const totalSurveys: number = getNumberOfSurveyByPatient(patient, mySurveys)
    const creationDate: Date = getLastCreationDate(patient, mySurveys)
    return (
      <Conversation
        avatarUrl={patient.avatarPicture}
        title={`${patient.firstName} ${patient.lastName}`}
        content={this.getItemContent(totalSurveys, incompleteSurveys)}
        badgeNumber={incompleteSurveys}
        postedAt={creationDate}
        onPress={() =>
          this.props.dispatch(
            NavAction.push('survey', { patientId: patient.uuid })
          )
        }
        iconName={'show-chart'}
      />
    )
  }

  render() {
    const { patients } = this.props
    return (
      <ListContainer
        testID={testId}
        data={patients}
        renderItem={this.renderRow}
      />
    )
  }
}

function select({
  healthrelationCache: { patients },
  survey: { mySurveys }
}: any) {
  return {
    patients: getPatientsWithLastSurveyDate(Object.values(patients), mySurveys),
    mySurveys
  }
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('surveys.subtitle')
)(SurveyByDossier)
