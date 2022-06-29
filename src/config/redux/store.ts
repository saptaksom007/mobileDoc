import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as Sentry from '@sentry/react-native'

import { getCommonKeycloakClient } from 'utilities/keycloak'
import { setLocalStorageImpl } from 'utilities/localStorage'
import { Env } from 'env'
import PersistStore from 'common-docdok/lib/configuration/persistStore'
import { setKeycloakImpl } from 'common-docdok/lib/common/Keycloak/keycloakProvider'
import middleware from './middlewares'
import reducers from './reducers'
import sagas from './sagas'
import { listenAsyncAction } from './middlewares/actionListener'

const sagaMiddleware = createSagaMiddleware({
  onError: __DEV__ ? console.warn : Sentry.captureException,
})
const createStoreWithMiddleware = applyMiddleware(
  ...middleware,
  sagaMiddleware,
  listenAsyncAction,
)(createStore)

export const configureStore = async () => {
  setLocalStorageImpl()
  const store = createStoreWithMiddleware(
    // @ts-ignore
    PersistStore.persistReducer(reducers),
  )
  setKeycloakImpl(getCommonKeycloakClient())
  await PersistStore.init({
    version: '1.0.0',
    name: 'mobile',
    environment: Env.environment as any,
    dev: __DEV__,
    select: (state: any) => ({
      dashboard: state.dashboard,
      scheduleappointment: state.scheduleappointment,
      appointmentslist: {
        markAsRead: state.appointmentslist.markAsRead,
      },
      photoviewer: {
        previews: Object.keys(state.photoviewer.previews)
          .map(k => ({
            id: k,
            ...state.photoviewer.previews[k],
          }))
          .sort((p1, p2) => p1.timestamp - p2.timestamp)
          .slice(0, 5)
          .reduce((prev, { id, ...rest }) => ({ ...prev, [id]: rest }), {}),
      },
    }),
    reduxStore: store,
  })
  sagaMiddleware.run(sagas as any)
  return store
}
