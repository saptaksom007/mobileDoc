import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { PhotoViewer } from '../PhotoViewer.component'

jest.mock('ex-react-native-i18n', () => ({
  t: (key: string) => key
}))

jest.mock(
  '@applications-developer/react-native-transformable-image',
  () => 'TransformableImage'
)

it('<PhotoViewer/> render correctly', () => {
  const tree = renderer
    .create(<PhotoViewer dataUrl="" dispatch={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
