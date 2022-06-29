import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { AppointmentsList } from '../AppointmentsList.component'

it('<AppointmentsList/> render correctly', () => {
  const tree = renderer
    .create(
      <AppointmentsList
        rawList={[]}
        patientSelf={{}}
        dispatch={() => {}}
        navigationData={{}}
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
