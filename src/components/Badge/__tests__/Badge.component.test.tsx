import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Badge } from 'components/Badge/Badge.component'

it('<Badge/> render correctly', () => {
  const tree = renderer.create(<Badge value={1} size={10} />).toJSON()
  expect(tree).toMatchSnapshot()
})
