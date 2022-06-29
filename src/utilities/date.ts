import i18n from 'ex-react-native-i18n'
import moment from 'moment'
import { BookAppointmentDayOfWeek } from 'api/types'

export const calendarOutputFormat = {
  sameDay: 'LT',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YY',
}

export const getCalendarOutputFormat = () => ({
  ...calendarOutputFormat,
  lastDay: `[${i18n.t('calendar.yesterday')}]`,
  nextDay: `[${i18n.t('calendar.tomorrow')}]`,
})

export const getCalendarOutputFormatWithToday = () => ({
  ...calendarOutputFormat,
  lastDay: `[${i18n.t('calendar.yesterday')}]`,
  nextDay: `[${i18n.t('calendar.tomorrow')}]`,
  sameDay: `[${i18n.t('calendar.today')}]`,
})

export const momentWithLocales = (date: string | number | Date) =>
  moment(date).locale(i18n.getFallbackLocale())

export const WeekDaysValue = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

export type WeekDay = typeof WeekDaysValue[number]

export const isDayStillInThisWorkWeek = (
  day: WeekDay | BookAppointmentDayOfWeek,
  now: Date = new Date(),
) => {
  const dateNumberNow = now.getDay()
  const dateNumberParam = WeekDaysValue.indexOf(day as WeekDay)
  return (
    dateNumberParam > 0 &&
    dateNumberParam < 6 &&
    dateNumberNow < dateNumberParam
  )
}
