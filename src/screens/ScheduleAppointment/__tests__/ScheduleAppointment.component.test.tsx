import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { ScheduleAppointment } from '../ScheduleAppointment.component'

jest.mock(
  'components/BookAppointmentLink/BookAppointmentLink.component',
  () => 'BookAppointmentLink',
)

it('<ScheduleAppointment/> render correctly', () => {
  const tree = renderer
    .create(
      <ScheduleAppointment
        name={'clinoxtest'}
        clinic={'clinoxtest'}
        date={''}
        street={'street'}
        location='location'
        phoneNumber='0303030303'
        conversationId={1}
        refreshing={false}
        dispatch={() => {}}
        navigation={{ state: { params: { appointmentId: 123 } } }}
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
