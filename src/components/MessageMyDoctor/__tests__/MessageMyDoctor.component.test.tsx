import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { MessageMyDoctor } from 'components/MessageMyDoctor/MessageMyDoctor.component'

it('<MessageMyDoctor/> log out', () => {
  const tree = renderer.create(<MessageMyDoctor />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('<MessageMyDoctor/> log in', () => {
  const tree = renderer.create(<MessageMyDoctor isLoggedIn />).toJSON()
  expect(tree).toMatchSnapshot()
})
