import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { SurveyWebview } from '../SurveyWebview.component'

it('<SurveyWebview/> render correctly', () => {
  const tree = renderer
    .create(
      <SurveyWebview
        dispatch={() => {}}
        navigation={
          {
            getParam: () => '',
          } as any
        }
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
