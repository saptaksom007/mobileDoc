import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { SampleError } from 'components/SampleError/SampleError.component'

it('<SampleError/> render correctly', () => {
  const tree = renderer.create(<SampleError />).toJSON()
  expect(tree).toMatchSnapshot()
})
