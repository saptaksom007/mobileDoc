import { pipe, prop } from 'ramda'

import { then, catchP } from 'utilities/pointFreePromise'
import { runRequestAsync } from 'utilities/axios'
import { REMEMBER_ME_KEY } from 'common-docdok/lib/domain/user/sagas/profile'
import { getStorageItem } from 'utilities/localStorage'

import { throwApiError } from './error'
import { getLimitedAccessTokenFromStoreAsyncWithParams } from './auth'

// get remember me
export const getRememberMeAsync = () => getStorageItem(REMEMBER_ME_KEY)

// Fetch user by id
export const fetchUserByIdAsync = (userId: unknown) =>
  pipe(
    getLimitedAccessTokenFromStoreAsyncWithParams,
    then((opts: any) =>
      runRequestAsync({
        url: `/rest/user/api/users/${opts.userId}`,
        method: 'GET',
        token: opts.token,
      }),
    ),
    then(prop('data')),
    catchP(throwApiError),
  )({ userId })

export const fetchUserDetailsAsync = () =>
  pipe(
    getLimitedAccessTokenFromStoreAsyncWithParams,
    then((opts: any) =>
      runRequestAsync({
        url: `/rest/user/api/users/me`,
        method: 'GET',
        token: opts.token,
      }),
    ),
    then(prop('data')),
    catchP(throwApiError),
  )
