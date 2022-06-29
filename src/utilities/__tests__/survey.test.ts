import { getSurveyUrlById } from '../survey'

jest.mock('env', () => ({
  Env: {
    api: {
      base: 'https://xaviercarpentier.com'
    }
  }
}))

it('should generate survey url', () => {
  expect(getSurveyUrlById(123)).toBeDefined()
  expect(getSurveyUrlById(456)).toBe(
    'https://xaviercarpentier.com/private/surveyparticipation/456'
  )
})
