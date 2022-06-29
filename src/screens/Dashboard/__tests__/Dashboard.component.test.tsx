import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Dashboard } from '../Dashboard.component'

jest.mock('components/Avatar/Avatar.component', () => null)
jest.mock('../components/Box', () => 'Box')
jest.mock('components/MessageMyDoctor/MessageMyDoctor.component')
jest.mock(
  'components/BookAppointmentLink/BookAppointmentLink.component',
  () => 'BookAppointmentLink',
)

it('<Dashboard/> render correctly', () => {
  const tree = renderer
    .create(
      <Dashboard
        origin={undefined}
        dispatch={() => {}}
        incompleteSurveys={0}
        unreadMessages={0}
        futureAppointmentsCount={0}
        clinics={[]}
        patient={{}}
        numberOfPatients={1}
        primaryConversation={'123'}
        onlyOneConversation={false}
        forceConversationId={0}
        primaryConversationId={0}
        scheduleAppointment={0}
        patients={[]}
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
