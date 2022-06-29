import { isUrl } from '../url'

describe('url', () => {
  it('should be false isUrl', () => {
    expect(isUrl('undefined?v=123455')).toBe(false)
  })
  it('should be true isUrl', () => {
    expect(isUrl('https://xaviercarpentier.com?v=123455')).toBe(true)
  })
})
