import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { AvailabilityList } from '../AvailabilityList.component'

it('<AvailabilityList/> render correctly', () => {
  const tree = renderer
    .create(<AvailabilityList clinics={[]} dispatch={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
