import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { BookAppointmentLink } from 'components/BookAppointmentLink/BookAppointmentLink.component'

it('<BookAppointmentLink/> render correctly', () => {
  const tree = renderer
    .create(
      <BookAppointmentLink
        conversationId={1}
        conversations={[]}
        dispatch={() => {}}
        patients={[]}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('<BookAppointmentLink/> render correctly, login', () => {
  const tree = renderer
    .create(
      <BookAppointmentLink
        dispatch={() => {}}
        isLoggedIn
        conversationId={1}
        conversations={[]}
        patients={[]}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
