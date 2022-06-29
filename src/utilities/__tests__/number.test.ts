import { isInteger } from '../number'

describe('number', () => {
  it('should be false isInteger', () => {
    ['abc', '', ' ', null, undefined].forEach((item: any) =>
      expect(isInteger(item)).toBe(false)
    )
  })
  it('should be true isInteger', () => {
    ['0', '1', 2, 3, 10, '12'].forEach((item: any) =>
      expect(isInteger(item)).toBe(true)
    )
  })
})
