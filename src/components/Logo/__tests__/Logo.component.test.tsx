import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Logo from 'components/Logo/Logo.component'

it('<Logo/> render correctly', () => {
  const tree = renderer.create(<Logo height={123} />).toJSON()
  expect(tree).toMatchSnapshot()
})
