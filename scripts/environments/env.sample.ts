import { getChannel, getEnvFromChannel } from 'utilities/channels'
import api from 'config/api.json'
import pkg from './package.json'

const channel = getChannel()
const environment = getEnvFromChannel(channel)
const AUTH_DOMAIN = api[environment] ? api[environment].auth : api.qa.auth
const API_DOMAIN = api[environment] ? api[environment].api : api.qa.api
const version = pkg.version

export const Env = {
  appName: 'mobile-docdok',
  version,
  publishedAt: '{{publishedAt}}',
  buildNumber: '{{buildNumber}}',
  environment,
  channel,
  keycloak: {
    url: `https://${AUTH_DOMAIN}/auth/`,
    realm: '{{realm}}',
    clientId: 'mobile',
    redirectUri: `https://${API_DOMAIN}`,
  },
  api: {
    base: `https://${API_DOMAIN}`,
    endpoints: {
      registerPushNotification: '/rest/messaging/api/notificationtokens',
    },
  },
  supportedVersion: `https://${API_DOMAIN}/version.json`,
  maintenance: `https://${API_DOMAIN}/maintenance.html`,
  storage: {
    authKey: 'login',
  },
  surveys: {
    completedMatchMessage: 'surveyCompleted',
  },
  helpUrl: 'https://docdok.atlassian.net/servicedesk/customer/portal/3',
  helpMailto:
    'mailto:supportdesk@docdok.atlassian.net?subject=docdok%20Kundendienstanfrage',
  e2e: undefined,
}
