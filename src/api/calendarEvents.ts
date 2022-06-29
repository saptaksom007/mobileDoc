import { pipe, prop } from 'ramda'
import { then, catchP } from 'utilities/pointFreePromise'

import { runRequestAsync } from 'utilities/axios'

import { throwApiError } from './error'
import { getLimitedAccessTokenFromStoreAsync } from './auth'
import { LIMITED_ACCESS_TOKEN_KEY } from 'config/auth'

export interface AddCalendarEventReqPayloadInterface {
  id?: number
  patientUuid: string
  physicianUuid: string
  name: string
  description: string
  startTime: string
  endTime: string
  seriesEndDate?: string | null
  type: string
  location: string
  pattern: string | null
  status: string
  url: string
  cb(index: number): void
}

export interface GetCalendarEventPAyload {
  patient_uuid: string
  couch_uuid: string
  distinct: boolean
}

export const getCalendarEventAsnyc = async (
  params: GetCalendarEventPAyload,
): Promise<any> =>
  pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/patient-activities-calendar?patientUuid=${params.patient_uuid}&physicianUuid=&distinct=${params.distinct}`,
        method: 'get',
        token,
      }),
    ),
    then(prop('data')),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)

export const addCalendarEventAsync = (
  params: AddCalendarEventReqPayloadInterface,
) =>
  pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/patient-activities`,
        method: params?.id ? 'put' : 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
        token,
      }),
    ),
    then(prop('data')),
    then(data => params.cb(data)),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)

export const deleteCalendarEventAsync = (params: {
  id: string
  isSeries: boolean
  cb: any
}) =>
  pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/patient-activities`,
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
        token,
      }),
    ),
    then(data => params?.cb(data)),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)

export const asyncGetPreSignedURLForUpload = (params: any) => {
  return pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/patient-activities-create-signed-url`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
        token,
      }),
    ),
    then(prop('data')),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)
}

export const asyncGetPreSignedURLForUploaledImage = (params: any) => {
  return pipe(
    getLimitedAccessTokenFromStoreAsync,
    then((token: string) =>
      runRequestAsync({
        url: `/rest/healthrelation/api/patient-activities-get-signed-url?patientActivityId=${params.patientActivityId}`,
        method: 'get',
        token,
      }),
    ),
    then(prop('data')),
    catchP(throwApiError),
  )(LIMITED_ACCESS_TOKEN_KEY)
}
