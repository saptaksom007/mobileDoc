import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import HomeLink from 'components/HomeLink/HomeLink.component'

it('<HomeLink/> render correctly', () => {
  const tree = renderer
    .create(<HomeLink title="test" iconName="test" onPress={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
