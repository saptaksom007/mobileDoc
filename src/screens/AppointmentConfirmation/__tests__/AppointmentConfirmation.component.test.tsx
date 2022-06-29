import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { AppointmentConfirmation } from '../AppointmentConfirmation.component'
import { NavigationScreenProp } from 'react-navigation'

jest.mock(
  'components/MessageMyDoctor/MessageMyDoctor.component',
  () => 'MessageMyDoctor',
)
jest.mock(
  'components/ExportAppointmentLink/ExportAppointmentLink.component',
  () => 'ExportAppointmentLink',
)

it('<AppointmentConfirmation/> render correctly', () => {
  const tree = renderer
    .create(
      <AppointmentConfirmation
        conversationId={1}
        dispatch={() => {}}
        appointment={{}}
        name=''
        navigation={{ state: { params: {} } } as NavigationScreenProp<any>}
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
