import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { DossierDetail } from '../DossierDetail.component'
import { NavigationScreenProp } from 'react-navigation'

it('<DossierDetail/> render correctly', () => {
  const tree = renderer
    .create(
      <DossierDetail
        showActionSheetWithOptions={() => {}}
        dispatch={() => {}}
        patients={{ key: { avatarPicture: '', primaryPhysicianUuid: 'key' } }}
        professionals={{
          123: { firstName: 'test', lastName: 'last', salutation: '' }
        }}
        navigation={
          { state: { params: { patientId: 'key' } } } as NavigationScreenProp<
            any,
            any
          >
        }
        conversationsArray={[{ id: 123 }]}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
