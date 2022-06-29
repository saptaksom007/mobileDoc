import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Clinic from '../Clinic.component'

jest.mock('components/PhoneNumber/PhoneNumber.component', () => 'PhoneNumber')

it('<Clinic/> render correctly', () => {
  const tree = renderer
    .create(
      <Clinic name="name" contact="0303003" location="wwww" street="asd" />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
