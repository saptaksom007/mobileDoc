
import { Env } from 'env'
import { curry } from 'ramda'

export const getTerms = curry(
  (baseUrl: string, local: string, version: string) =>
    `${baseUrl}/termsAndConditions/terms.${version}.${local}.html`
)

export const getTermsWithEnv = getTerms(Env.api.base)

export const getTermsEN = getTermsWithEnv('en')

export const getTermsDE = getTermsWithEnv('de')
