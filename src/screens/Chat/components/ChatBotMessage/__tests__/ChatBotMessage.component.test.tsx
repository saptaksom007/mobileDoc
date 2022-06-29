import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import ChatBotMessage from '../ChatBotMessage.component'

it('<ChatBotMessage/> render correctly', () => {
  const tree = renderer
    .create(
      <ChatBotMessage
        title="title test"
        items={[{ title: '', subtitle: '' }]}
        iconName="test"
        iconType="test"
        position="right"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
