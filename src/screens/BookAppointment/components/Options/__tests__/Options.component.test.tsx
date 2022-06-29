import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Options from '../Options.component'

it('<Options/> render correctly', () => {
  const tree = renderer.create(<Options title="test" values={[]} />).toJSON()
  expect(tree).toMatchSnapshot()
})
