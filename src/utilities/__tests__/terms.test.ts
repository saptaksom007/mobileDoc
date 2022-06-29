import { Env } from 'env'
import { getTerms, getTermsWithEnv, getTermsEN, getTermsDE } from '../terms'

describe('TermsUtil', () => {
  it('getTerms', () => {
    expect(getTerms('https://local', 'en', '2018-04-03')).toBe(
      'https://local/termsAndConditions/terms.2018-04-03.en.html'
    )
  })
  it('getTermsWithEnv', () => {
    expect(getTermsWithEnv('en', '2018-04-03')).toBe(
      `${Env.api.base}/termsAndConditions/terms.2018-04-03.en.html`
    )
  })

  it('getTermsEN', () => {
    expect(getTermsEN('2018-04-03')).toBe(
      `${Env.api.base}/termsAndConditions/terms.2018-04-03.en.html`
    )
  })

  it('getTermsDE', () => {
    expect(getTermsDE('2018-04-03')).toBe(
      `${Env.api.base}/termsAndConditions/terms.2018-04-03.de.html`
    )
  })
})
