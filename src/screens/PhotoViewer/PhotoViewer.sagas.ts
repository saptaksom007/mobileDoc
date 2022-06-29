import * as Crypto from 'expo-crypto'
import * as FileSystem from 'expo-file-system'
import { put, takeEvery, call, takeLatest } from 'redux-saga/effects'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { ActionTypes as ChatActionTypes } from 'screens/Chat/Chat.actions'
import { getMedia } from 'utilities/commonViewerSaga'
import { messagingActionTypes } from 'common-docdok/lib/domain/messaging/actions'
import MediaCache from 'common-docdok/lib/utils/mediaCache'

import Actions, { ActionTypes } from './PhotoViewer.actions'
import { api } from 'common-docdok'
import { MediaResource } from 'api/types'

const Cache: any = new MediaCache()

function* fetchPhoto(action: any) {
  try {
    const preview = false
    yield getMedia(action, preview)
  } catch (err) {
    yield put(Actions.photoViewerFailed(err))
  }
}

function* gotoPhotoViewer(action: any) {
  try {
    const { dataUrl, mimeType, preview, uuid } = action.payload
    if (mimeType !== 'application/pdf' && !preview) {
      yield put(Actions.photoViewerSucceeded(dataUrl, uuid))
    }
  } catch (err) {
    yield put(Actions.photoViewerFailed(err))
  }
}

const getImageFileSystemKey = async (uuid: string) => {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    uuid,
  )
  return `${FileSystem.cacheDirectory}${hashed}`
}

function* fetchPhotoPreview(action: {
  payload: { mediaResource: MediaResource }
  type: string
}) {
  try {
    const {
      mediaResource: { uuid },
    } = action.payload
    if (uuid) {
      const filesystemURI = yield call(getImageFileSystemKey, uuid)
      const metadata: FileSystem.FileInfo = yield call(
        FileSystem.getInfoAsync,
        filesystemURI,
      )
      if (metadata.exists) {
        yield put(Actions.photoViewerPreviewSucceeded(filesystemURI, uuid))
      } else {
        const { data: signedUrl } = yield call(api.getMediaRedirectUrl, uuid)
        const dowloadResult: FileSystem.DownloadResult = yield call(
          FileSystem.downloadAsync,
          signedUrl,
          filesystemURI,
        )
        yield put(Actions.photoViewerPreviewSucceeded(dowloadResult.uri, uuid))
      }
    } else {
      yield put(
        Actions.photoViewerPreviewFailed(new Error('no uuid for resource')),
      )
    }
  } catch (err) {
    yield put(Actions.photoViewerPreviewFailed(err))
  }
}

function* showPhotoPreview(action: any) {
  try {
    const { dataUrl, mimeType, uuid, preview } = action.payload
    if (mimeType !== 'application/pdf' && preview) {
      const timestamp = new Date().getTime()
      yield put(Actions.photoViewerPreviewSucceeded(dataUrl, uuid, timestamp))
    }
  } catch (error) {
    yield put(Actions.photoViewerPreviewFailed(error))
  }
}

function* cacheLocalPhoto(action: any) {
  try {
    const { mediaResourceId, dataUri, uri } = action.payload
    if (dataUri) {
      yield call(Cache.set, mediaResourceId, uri)
      yield put(Actions.localPhotoCached())
    }
  } catch (error) {
    yield put(Actions.photoViewerPreviewFailed(error))
  }
}

function* pop() {
  yield put(NavAction.pop())
}

function* navigateToPhotoViewer({ payload }: any) {
  if (typeof payload === 'string') {
    yield put(NavAction.push('photoviewer', { url: payload }))
  } else {
    const { uuid } = payload
    yield put(NavAction.push('photoviewer', { uuid }))
  }
}

export default [
  takeEvery(ActionTypes.PHOTOVIEWER_REQUESTED, fetchPhoto),
  takeEvery(ActionTypes.PHOTOVIEWER_PREVIEW_REQUESTED, fetchPhotoPreview),
  takeEvery(ActionTypes.PHOTOVIEWER_POP, pop),
  takeEvery(messagingActionTypes.GET_MEDIA_RESOURCE_SUCCEEDED, gotoPhotoViewer),
  takeEvery(
    messagingActionTypes.GET_MEDIA_RESOURCE_SUCCEEDED,
    showPhotoPreview,
  ),
  takeEvery(ChatActionTypes.ADD_PHOTO_SUCCEEDED, cacheLocalPhoto),
  takeLatest(ActionTypes.NAVIGATE_TO_PHOTO_VIEWER, navigateToPhotoViewer),
]
