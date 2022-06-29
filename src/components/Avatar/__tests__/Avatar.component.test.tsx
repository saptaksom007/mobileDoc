import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Avatar } from 'components/Avatar/Avatar.component'

it('<Avatar/> render correctly', () => {
  const tree = renderer
    .create(<Avatar name={'test'} size={10} style={{}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
