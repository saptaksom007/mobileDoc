import { optsRetrieveTokens, expireToken } from '../auth'

describe('Auth API', () => {
  it('should get options with optsRetrieveTokens', () => {
    expect(optsRetrieveTokens('code')).toBeDefined()
  })
  it('should test if token is valid', () => {
    const expires = Date.now() - 10
    expect(expireToken(expires)).toBe(false)
  })
  it('should test if token is not valid', () => {
    const expires = Date.now() + 10
    expect(expireToken(expires)).toBe(true)
  })
})
