import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { Login } from '../Login.component'

jest.mock('utilities/keycloak', () => ({
  getLoginURL() {
    return 'https://xaviercarpentier.com'
  },
}))

jest.mock('components/Loader/Loader.component', () => ({ Loader: 'Loader' }))

it('<Login/> render correctly', () => {
  const tree = renderer.create(<Login dispatch={() => {}} />).toJSON()
  expect(tree).toMatchSnapshot()
})
