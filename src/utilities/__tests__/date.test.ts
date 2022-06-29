import { isDayStillInThisWorkWeek } from '../date'

it('isDayStillInThisWorkWeek', () => {
  expect(isDayStillInThisWorkWeek('tuesday', new Date(2019, 8, 2))).toBe(true)
  expect(isDayStillInThisWorkWeek('monday', new Date(2019, 8, 2))).toBe(false)
  expect(isDayStillInThisWorkWeek('monday', new Date(2019, 8, 3))).toBe(false)
  expect(isDayStillInThisWorkWeek('wednesday', new Date(2019, 8, 5))).toBe(
    false,
  )
})
