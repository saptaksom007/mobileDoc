import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import ListContainer from 'components/ListContainer/ListContainer.component'

it('<ListContainer/> render correctly', () => {
  const tree = renderer
    .create(<ListContainer data={[]} renderItem={() => null} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
