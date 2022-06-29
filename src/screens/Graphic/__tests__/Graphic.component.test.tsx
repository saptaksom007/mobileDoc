import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Graphic } from '../Graphic.component'

it('<Graphic/> render correctly', () => {
  const tree = renderer
    .create(<Graphic data={[{ date: 1583249764616, value: 1 }]} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
