import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import DropdownAlert from '../DropdownAlert.component'

it('<DropdownAlert/> render correctly', () => {
  const tree = renderer.create(<DropdownAlert />).toJSON()
  expect(tree).toMatchSnapshot()
})
