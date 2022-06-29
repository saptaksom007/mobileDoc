import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { ConversationsList } from '../ConversationsList.component'

it('<ConversationsList/> render correctly', () => {
  const tree = renderer
    .create(
      <ConversationsList
        dispatch={() => {}}
        messaging={{ conversations: {}, checkedMessages: {} }}
        users={{}}
        navigation={{
          state: {
            params: {
              otherFilter: () => {}
            }
          }
        }}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
