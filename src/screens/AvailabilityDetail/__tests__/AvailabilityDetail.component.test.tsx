import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { AvailabilityDetail } from '../AvailabilityDetail.component'

jest.mock(
  'components/MessageMyDoctor/MessageMyDoctor.component',
  () => 'MessageMyDoctor'
)

it('<AvailabilityDetail/> render correctly', () => {
  const tree = renderer
    .create(
      <AvailabilityDetail
        navigation={{
          state: {
            params: {
              clinicName: 'clinicName',
              clinicStreet: 'clinicStreet',
              clinicLocation: 'clinicLocation',
              clinicContact: 'clinicContact',
              clinicMessage: 'clinicMessage',
              doctorMessage: 'doctorMessage',
              physicianRef: 'physicianRef'
            }
          }
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
