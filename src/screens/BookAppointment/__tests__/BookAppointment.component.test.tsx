import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { BookAppointment } from '../BookAppointment.component'
import { NavigationScreenProp } from 'react-navigation'

it('<BookAppointment/> render correctly', () => {
  const tree = renderer
    .create(
      <BookAppointment
        dispatch={() => {}}
        doctors={[]}
        preferredDate="thisMonth"
        preferredDayOfWeek="friday"
        preferredTimeOfDay="afternoon"
        preferredDoctor={0}
        otherDoctor=""
        doctorsOptions={[]}
        navigation={
          { state: { params: { conversationId: 1 } } } as NavigationScreenProp<
            any,
            any
          >
        }
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
