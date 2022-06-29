import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Survey } from '../Survey.component'
import { NavigationScreenProp } from 'react-navigation'

it('<Survey/> render correctly', () => {
  const tree = renderer
    .create(
      <Survey
        users={{
          123: {}
        }}
        dispatch={() => {}}
        mySurveys={[]}
        navigation={{ state: { params: {} } } as NavigationScreenProp<any, any>}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('<Survey/> render correctly', () => {
  const tree = renderer
    .create(
      <Survey
        users={{
          123: {}
        }}
        dispatch={() => {}}
        mySurveys={[
          {
            senderRef: '123',
            completionDate: '',
            surveyName: 'Test survey',
            id: 1
          }
        ]}
        navigation={{ state: { params: {} } } as NavigationScreenProp<any, any>}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
