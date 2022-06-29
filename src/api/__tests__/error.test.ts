import * as error from '../error'

describe('API', () => {
  it('should throw error', () => {
    const expected = 'error test'
    const errorParam = {
      name: 'errortest',
      message: 'errortest',
      response: {
        data: {
          error: expected,
          description: expected,
          message: expected
        }
      }
    }
    try {
      error.throwApiError(errorParam)
    } catch (err) {
      const expectedExpected = '[500] GET <undefined url>'
      expect(err.message).toBe(expectedExpected)
    }
  })
})
