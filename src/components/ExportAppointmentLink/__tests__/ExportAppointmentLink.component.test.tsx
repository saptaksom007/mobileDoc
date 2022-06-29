import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { ExportAppointmentLink } from 'components/ExportAppointmentLink/ExportAppointmentLink.component'

it('<ExportAppointmentLink/> render correctly', () => {
  const tree = renderer
    .create(
      <ExportAppointmentLink
        dispatch={() => {}}
        appointment={{}}
        isLoggedIn
        showActionSheetWithOptions={() => {}}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
