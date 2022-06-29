import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Chat } from '../Chat.component'

jest.mock('react-native-gifted-chat', () => ({
  GiftedChat: () => 'GiftedChat',
}))
jest.mock('expo-av', () => ({
  Video: () => 'Video',
}))

it('<Chat/> render correctly', () => {
  const tree = renderer
    .create(
      <Chat
        showActionSheetWithOptions={() => {}}
        profile={{ uid: '123' }}
        dispatch={() => {}}
        messages={[]}
        latestMessage={{} as any}
        selectedConversation={1}
        conversationTitle={'a fake title'}
        isTyping={false}
        navigation={
          {
            state: { params: {} },
            addListener: () => {},
          } as any
        }
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
