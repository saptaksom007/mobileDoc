import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { NotificationsList } from '../NotificationsList.component'

jest.mock(
  'components/Conversation/Conversation.component',
  () => 'Conversation'
)

it('<NotificationsList/> render correctly', () => {
  const tree = renderer
    .create(
      <NotificationsList
        dispatch={() => {}}
        notificationsList={[]}
        surveyDefinitionsById={{ 123: {} }}
        notificationId={123}
        appointments={{
          15: {}
        }}
        users={{
          '0cbe4673-8eec-48ad-adad-594f3c02e729': {
            avatarPicture: ''
          }
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('<NotificationsList/> render correctly with survey', () => {
  const tree = renderer
    .create(
      <NotificationsList
        surveyDefinitionsById={{ 123: {} }}
        notificationId={123}
        appointments={{
          15: {}
        }}
        dispatch={() => {}}
        users={{
          '0cbe4673-8eec-48ad-adad-594f3c02e729': {
            avatarPicture: ''
          }
        }}
        notificationsList={[
          {
            id: 1443,
            uuid: '6f0e507d-e9fe-478a-ae02-55006c4745fb',
            text: '',
            userRef: '0cbe4673-8eec-48ad-adad-594f3c02e729',
            postedAt: '2018-07-05T10:19:07+02:00',
            sequenceNo: 1,
            mediaResource: null,
            conversationId: 650,
            meta: {
              surveyId: '15',
              patientuuid: 'PAT-251b7fdc-2eec-48fa-ae80-34a725e669c3',
              surveyName: 'Erstanmeldung Erwachsene',
              senderRef: '0cbe4673-8eec-48ad-adad-594f3c02e729',
              subtype: 'SURVEY_COMPLETED',
              notificationtype: 'SURVEY',
              id: '18',
              creationDate: '2018-07-05T10:19:02+02:00',
              url:
                'https://qa.dev.docdok.ch/limesurvey/index.php/16953?token=a8FoImzZhmoVzt0&newtest=Y&lang='
            }
          }
        ]}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('<NotificationsList/> render correctly with appointment', () => {
  const tree = renderer
    .create(
      <NotificationsList
        surveyDefinitionsById={{ 123: {} }}
        notificationId={123}
        dispatch={() => {}}
        appointments={{
          15: {}
        }}
        users={{
          '0cbe4673-8eec-48ad-adad-594f3c02e729': {
            avatarPicture: ''
          }
        }}
        notificationsList={[
          {
            id: 1443,
            uuid: '6f0e507d-e9fe-478a-ae02-55006c4745fb',
            text: '',
            userRef: '0cbe4673-8eec-48ad-adad-594f3c02e729',
            postedAt: '2018-07-05T10:19:07+02:00',
            sequenceNo: 1,
            mediaResource: null,
            conversationId: 650,
            meta: {
              appointmentId: '15',
              notificationtype: 'APPOINTMENT'
            }
          }
        ]}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
