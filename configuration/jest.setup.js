jest.mock('utilities/environment', () => ({
  isStage: () => false,
  isProduction: () => false,
  getTestId: id => id,
}))

jest.mock('api', () => ({
  retrieveTokensAsync: () => '',
  APIContext: {
    store: {
      getState: () => ({}),
    },
  },
}))

jest.mock('utilities/channels', () => ({
  getChannel: () => 'default',
  getEnvFromChannel: () => 'qa',
}))

jest.mock('sentry-expo', () => ({
  captureException: e => e,
}))

jest.mock('navigation/SagaNavigation', () => ({
  Actions: {
    immediatelyResetStack: () => {},
    push: () => {},
  },
}))

jest.mock('ex-react-native-i18n', () => ({
  t: key => key,
  locale: 'en',
  getFallbackLocale: () => 'en',
  currentLocale: () => 'en',
}))

jest.mock('react-native-elements', () => ({
  Card: () => null,
  List: () => null,
  ListItem: () => 'none',
  Button: () => 'none',
  ButtonGroup: () => 'none',
  Icon: () => null,
  Divider: () => null,
  FormInput: () => null,
}))

jest.mock('react-native-webview', () => ({
  WebView: () => 'WebView',
}))
