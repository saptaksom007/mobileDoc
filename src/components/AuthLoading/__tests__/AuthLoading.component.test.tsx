import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { AuthLoading } from 'components/AuthLoading/AuthLoading.component'

jest.mock('components/Loader/Loader.component', () => ({ Loader: 'Loader' }))

it('<AuthLoading/> render correctly', () => {
  const tree = renderer.create(<AuthLoading />).toJSON()
  expect(tree).toMatchSnapshot()
})
