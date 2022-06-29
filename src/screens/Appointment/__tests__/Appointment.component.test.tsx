import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Appointment } from '../Appointment.component'
import { NavigationScreenProp } from 'react-navigation'

jest.mock(
  'components/MessageMyDoctor/MessageMyDoctor.component',
  () => 'MessageMyDoctor'
)
jest.mock(
  'components/ExportAppointmentLink/ExportAppointmentLink.component',
  () => 'ExportAppointmentLink'
)

it('<Appointment/> render correctly', () => {
  const tree = renderer
    .create(
      <Appointment
        navigation={
          { state: { params: { appointmentId: 0 } } } as NavigationScreenProp<
            any
          >
        }
        dispatch={() => {}}
        appointment={{}}
        name=""
        patientSelf={{}}
        conversationId={0}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
