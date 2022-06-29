import React, { Component } from 'react'

import { ScrollView, InteractionManager, View } from 'react-native'
import { ListItem, List } from 'react-native-elements'
import { connect } from 'react-redux'
import isString from 'lodash/isString'
import i18n from 'ex-react-native-i18n'
import { Paragraph } from 'components/CustomText/CustomText.component'
import { surveyActions } from 'common-docdok/lib/domain/survey/actions'
import { findPatientSelf } from 'common-docdok/lib/domain/healthrelation/selectors/findPatient'

import { compose } from 'recompose'
import { propOr, pipe, find } from 'ramda'
import { NavigationScreenProp } from 'react-navigation'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import NotificationsActions from 'notifications/actions'
import EmptyList from 'components/EmptyList/EmptyList.component'
import withSubtitle from 'screens/enhancers/withSubtitle'
import GraphicActions from 'screens/Graphic/Graphic.actions'

import { momentWithLocales } from 'utilities/date'
import toString from 'common-docdok/lib/utils/toString'

import { Color } from 'constants/Color'
import { Env } from 'env'

import Actions from './Survey.actions'
import styles from './Survey.styles'

function getSubtitle(survey: any) {
  const datePattern = 'DD.MM.YY, hh:mm A'

  const creationDate = momentWithLocales(survey.creationDate).format(
    datePattern,
  )
  return (
    <View style={{ marginLeft: 10, marginTop: 5 }}>
      <Paragraph style={{ color: '#999' }}>{`${i18n.t(
        'surveys.sent',
      )} ${creationDate}`}</Paragraph>
      <Paragraph style={{ color: '#999' }}>{`${
        !survey.completionDate
          ? i18n.t('surveys.notComplete')
          : i18n.t('surveys.complete') +
            ' - ' +
            momentWithLocales(survey.completionDate).format(datePattern)
      }`}</Paragraph>
    </View>
  )
}

function getTitle(survey: any, doctor: any) {
  const surveyName = propOr<string, any, string>(
    i18n.t('surveys.default.surveyName'),
    'surveyName',
    survey,
  )
  return `${surveyName}${surveyName.length > 50 ? '\n' : ' '}${i18n.t(
    'surveys.from',
  )} ${toString.person(doctor)}`
}

interface Props {
  dispatch(action: any): void
  mySurveys: any[]
  users: { [key: string]: any }
  navigation: NavigationScreenProp<any, any>
  patientSelfId?: string
}
const filterPatient = (patientId: string) => (survey: any) =>
  survey.patientUuid === patientId

export class Survey extends Component<Props> {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { dispatch } = this.props
      dispatch(surveyActions.getMySurveysRequested())
      dispatch(NotificationsActions.removeNotificationRequested('SURVEY'))
    })
  }

  selectSurvey(survey: any) {
    const {
      dispatch,
      navigation: {
        state: {
          params: { patientId },
        },
      },
    } = this.props
    if (survey.completionDate) {
      if (__DEV__) {
        this.props.dispatch(
          GraphicActions.graphicRequested(Number(survey.surveyId), patientId),
        )
      }
      dispatch(
        NavAction.showLocalWarning(i18n.t('surveys.alert.completionDate')),
      )
    } else {
      const url = `${Env.api.base}/private/surveyparticipation/${survey.id}`
      dispatch(Actions.selectSurveyRequested(url, patientId))
    }
  }

  render() {
    const {
      mySurveys,
      users,
      dispatch,
      navigation: {
        state: { params },
      },
      patientSelfId,
    } = this.props

    const surveys =
      (
        mySurveys &&
        mySurveys.filter(filterPatient(params.patientId || patientSelfId))
      ).sort(
        (s1, s2) =>
          new Date(s2.creationDate || 0).getTime() -
          new Date(s1.creationDate || 0).getTime(),
      ) || []

    if (!surveys || surveys.length === 0) {
      return (
        <EmptyList
          text={i18n.t('surveys.empty')}
          show
          onPress={() => dispatch(surveyActions.getMySurveysRequested())}
        />
      )
    }

    return (
      <ScrollView style={styles.container}>
        <List containerStyle={styles.listContainer}>
          {surveys.map((survey: any) => (
            <ListItem
              key={survey.id}
              title={getTitle(survey, users[survey.senderRef])}
              titleNumberOfLines={4}
              containerStyle={styles.itemContainerStyle}
              titleStyle={styles.itemTitleStyle}
              subtitle={getSubtitle(survey)}
              subtitleStyle={styles.itemSubtitleStyle}
              onPress={() => this.selectSurvey(survey)}
              hideChevron={isString(survey.completionDate)}
              chevronColor={Color.tintColor}
            />
          ))}
        </List>
      </ScrollView>
    )
  }
}

function select({
  survey: { mySurveys },
  healthrelation: { patients },
  userCache: { users },
}: any) {
  const patientSelfId = pipe(
    find(findPatientSelf),
    propOr('', 'uuid'),
  )(patients)
  return { mySurveys, users, patientSelfId }
}

export default compose<Props, any>(
  connect(select),
  withSubtitle('surveys.subtitle'),
)(Survey)
