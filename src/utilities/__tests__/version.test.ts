import { hasMinVersion } from '../version'

describe('hasMinVersion', () => {
  it('should check versions correctly', () => {
    expect(hasMinVersion('1.2.0', '1.2.0')).toBe(true)
    expect(hasMinVersion('1.2.0', '1.1.3')).toBe(false)
    expect(hasMinVersion('1.2.0', '0.1.3')).toBe(false)
    expect(hasMinVersion('1.2.0', '1.2.1')).toBe(true)
    expect(hasMinVersion('1.2.0', '1.3.0')).toBe(true)
    expect(hasMinVersion('1.2.0', '2.2.1')).toBe(true)
  })
})
