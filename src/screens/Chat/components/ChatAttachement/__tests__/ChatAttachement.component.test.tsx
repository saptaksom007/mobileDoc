import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { ChatAttachement } from '../ChatAttachement.component'

it('<Chat/> render correctly', () => {
  const tree = renderer
    .create(
      <ChatAttachement
        position='right'
        dispatch={() => {}}
        pdfreader={{
          previews: {},
        }}
        photoviewer={{
          previews: {},
        }}
        canFetchPreview
        message={{
          _id: '123',
          user: {
            _id: '456',
          },
          createdAt: new Date(),
          text: '',
          mediaResource: {
            previewUrl: 'http://via.placeholder.com/350x150',
            originalUrl: 'http://via.placeholder.com/350x150',
          },
          meta: {
            originalSize: 123,
          },
        }}
      />,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
