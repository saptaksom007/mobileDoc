import {
  BookAppointmentDate,
  BookAppointmentDayOfWeek,
  BookAppointmentTime
} from 'api/types'

export type OptionType =
  | BookAppointmentDate
  | BookAppointmentDayOfWeek
  | BookAppointmentTime
  | number
  | undefined
  | boolean

export interface PreferredOption {
  preferredDate?: BookAppointmentDate
  preferredDayOfWeek?: BookAppointmentDayOfWeek
  preferredTimeOfDay?: BookAppointmentTime
  preferredDoctor?: number
}
