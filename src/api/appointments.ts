import { pipe, prop, propEq, propSatisfies, filter, reject } from 'ramda'
import { then, catchP } from 'utilities/pointFreePromise'

import uniq from 'lodash/uniq'
import moment from 'moment'
import { runRequestAsync } from 'utilities/axios'
import { fetchUserByIdAsync } from './user'

import {
  getLimitedAccessTokenFromStoreAsyncWithParams,
  getLimitedAccessTokenFromStoreAsync,
} from './auth'

import { throwApiError } from './error'
import { LIMITED_ACCESS_TOKEN_KEY } from 'config/auth'

/**
 * Add physician avatar to appointment
 * @param {AppointmentDtoType} messages
 * @return {Promise<AppointmentDtoType>} messages with avatars and names
 */
export const addPhysicianAvatarToAppointment = async (
  appointment: any,
): Promise<any> => {
  const physician = await fetchUserByIdAsync(appointment.physicianUserRef)
  return {
    ...appointment,
    physicianAvatarPicture: `${physician.avatarPicture}?v=${Date.now()}`,
  }
}

/**
 * Add physician avatar all appointments
 * @param {object[]} messages
 * @return {Promise<object[]>} messages with avatars and names
 */
export const addPhysicianAvatarsToAppointments = async (
  appointments: any,
): Promise<any> => {
  const usersIds = uniq(appointments.map((app: any) => app.physicianUserRef))
  const users: any = await Promise.all(usersIds.map(fetchUserByIdAsync))
  const userMap: any = users.reduce(
    (prev: any, current: any) => ({ ...prev, [current.uid]: current }),
    {},
  )
  return appointments.map((app: any) => ({
    ...app,
    physicianAvatarPicture:
      userMap[app.physicianUserRef] &&
      userMap[app.physicianUserRef].avatarPicture,
  }))
}

export const isInTheFurture = (dataToTest: string | Date | number): boolean =>
  moment().diff(dataToTest) < 0
export const isInTheFuture = propSatisfies(isInTheFurture, 'appointmentTime')
export const filterOldAppointment = (appointments: any[]) =>
  filter(isInTheFuture, appointments)

export const isMarkAsRead = propEq('markAsRead', true)
export const filterMarkAsRead = reject(isMarkAsRead)
export const getMarkAsRead = filter(isMarkAsRead)

export const fetchAppointmentsListAsync = () =>
  pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: '/rest/healthrelation/api/appointments',
        method: 'GET',
        token,
      }),
    ),
    then(prop('data')),
    then(addPhysicianAvatarsToAppointments),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)

export const fetchAppointmentByIdAsync = (params: { id: number }) =>
  pipe(
    getLimitedAccessTokenFromStoreAsyncWithParams,
    then(({ token, id }) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/appointments/${id}`,
        method: 'GET',
        token,
      }),
    ),
    then(prop('data')),
    then(addPhysicianAvatarToAppointment),
    catchP(throwApiError),
  )(params)
