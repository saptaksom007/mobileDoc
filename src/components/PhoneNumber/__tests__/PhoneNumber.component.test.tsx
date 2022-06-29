import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { PhoneNumber } from 'components/PhoneNumber/PhoneNumber.component'

it('<PhoneNumber/> render correctly', () => {
  const tree = renderer
    .create(<PhoneNumber value={'0300000000'} dispatch={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
