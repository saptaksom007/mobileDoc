import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { SurveyByDossier } from '../SurveyByDossier.component'

it('<SurveyByDossier/> render correctly', () => {
  const tree = renderer
    .create(
      <SurveyByDossier dispatch={() => {}} patients={[]} mySurveys={[]} />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
