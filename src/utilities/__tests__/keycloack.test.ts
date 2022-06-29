import KeycloakUtil, {
  addSlashToUrl,
  concatUrl,
  getRealmUrl
} from 'utilities/keycloak'
import { Env } from 'env'

describe('KeycloakUtil', () => {
  it('should add slash to url with no slash', () => {
    expect(addSlashToUrl('http://xaviercarpentier.com')).toEqual(
      'http://xaviercarpentier.com/'
    )
  })
  it('should not add slash to url with slash', () => {
    expect(addSlashToUrl('http://xaviercarpentier.com/')).toEqual(
      'http://xaviercarpentier.com/'
    )
  })
  it('should concatUrl', () => {
    expect(concatUrl('http://xaviercarpentier.com/', 'contact')).toEqual(
      'http://xaviercarpentier.com/contact'
    )
  })
  it('should getRealUrl', () => {
    expect(getRealmUrl(Env.keycloak.url, Env.keycloak.realm)).toEqual(
      `${Env.keycloak.url}realms/${Env.keycloak.realm}`
    )
  })
  it('should getLoginURL', () => {
    expect(KeycloakUtil.getLoginURL()).toBeTruthy()
  })
  it('should getCodeAndStateFromUrl', () => {
    const url = 'http://localhost/?state=STATE&code=CODE'
    const expected = { state: 'STATE', code: 'CODE' }
    expect(KeycloakUtil.getCodeAndStateFromUrlQuestionMark(url)).toEqual(
      expected
    )
  })
  it('should getCodeAndStateFromUrlHash', () => {
    const url = 'http://localhost/#state=STATE&code=CODE'
    const expected = { state: 'STATE', code: 'CODE' }
    expect(KeycloakUtil.getCodeAndStateFromUrlHash(url)).toEqual(expected)
  })
  it('should getCodeAndStateFromUrl with hash', () => {
    const expected = { state: 'STATE', code: 'CODE' }

    const url = 'http://localhost/#state=STATE&code=CODE'
    expect(KeycloakUtil.getCodeAndStateFromUrl(url)).toEqual(expected)

    const url2 = 'http://localhost/?state=STATE&code=CODE'
    expect(KeycloakUtil.getCodeAndStateFromUrl(url2)).toEqual(expected)
  })
})
