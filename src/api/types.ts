import { IMessage } from 'react-native-gifted-chat'

// Authentication objects types (information we need)
export type Token = string
export interface Tokens {
  access_token: Token
  refresh_token: Token
  expires_in: number
  refresh_expires_in: number
}
export interface TokenWrapper {
  token: Token
  userId?: number
  conversationId?: number
  sequenceNo?: number
  text?: string
  uuid?: string
  secret?: string
  mimeTypeString?: string
  file?: string
  url?: string
}

// Conversation objects types
export interface ChatUser {
  _id: string
  avatar?: string
  name?: string
}
export interface MediaResource {
  uuid?: string
  mimeType?: string
  previewUrl?: string
  originalUrl?: string
  previewRedirectUri?: string
  originalRedirectUri?: string
}

export interface ChatMessage extends IMessage {
  _id: string | number
  text: string
  user: ChatUser
  createdAt: Date | number
  sent?: boolean
  sequenceNo?: number
  meta?: {
    subtype?: 'appointmentRequest' | 'NEW_SURVEY' | 'videoInvitation'
    originalSize?: number
    notificationtype?: 'SURVEY'
    interaction?: {
      result?: any
    }
  }
  mediaResource?: MediaResource
  image?: string
  isEmbedVideo?: boolean
  isEmbedImage?: boolean
  isVimeo?: boolean
}

// Image picker type
export type picker = 'camera' | 'library' | 'pdf'

// Book Appointment Date
export const BookAppointmentDateValues = [
  'anyDate',
  'urgent',
  'thisWeek',
  'withinTwoWeeks',
  'thisMonth',
] as const

export type BookAppointmentDate = typeof BookAppointmentDateValues[number]

// Book Appointment day
export const BookAppointmentDayOfWeekValues = [
  'anyDayOfWeek',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
] as const
// tslint:disable-next-line:max-line-length
export type BookAppointmentDayOfWeek = typeof BookAppointmentDayOfWeekValues[number]

// Book Appointment Time
export const BookAppointmentTimeValues = [
  'anyTime',
  'morning',
  'afternoon',
] as const

export type BookAppointmentTime = typeof BookAppointmentTimeValues[number]

export type ChatPositionType = 'left' | 'right'
