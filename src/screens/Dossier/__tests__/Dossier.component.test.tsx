import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Dossier } from '../Dossier.component'

it('<Dossier/> render correctly', () => {
  const tree = renderer
    .create(<Dossier dispatch={() => {}} patients={[]} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
