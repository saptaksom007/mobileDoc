import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { PdfReader } from '../PdfReader.component'

jest.mock('rn-pdf-reader-js', () => 'rn-pdf-reader-js')

it('<PdfReader/> render correctly', () => {
  const tree = renderer
    .create(<PdfReader dataUrl="" dispatch={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
