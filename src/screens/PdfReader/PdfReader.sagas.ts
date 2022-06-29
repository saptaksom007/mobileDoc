import { put, takeEvery, call } from 'redux-saga/effects'
import { Platform } from 'react-native'

import { Actions as NavAction } from 'navigation/SagaNavigation'
import { getMedia } from 'utilities/commonViewerSaga'
import {
  messagingActions,
  messagingActionTypes,
} from 'common-docdok/lib/domain/messaging/actions'

import CommonApi from 'common-docdok/lib/api'
import { Env } from 'env'

import Actions, { ActionTypes } from './PdfReader.actions'
import { checkAndGetTokenAsync } from 'api/auth'

function* fetchPdfReader(action: any) {
  try {
    const isPreview = false
    const { mediaResource } = action.payload
    // if (Platform.OS === 'ios') {
    yield put(
      messagingActions.getMediaResourceRequested(
        mediaResource.uuid,
        isPreview,
        'application/pdf',
      ),
    )
  } catch (err) {
    yield put(Actions.pdfReaderFailed(err))
  }
}

function* goToPdfReader(action: any) {
  try {
    const { dataUrl, mimeType, uuid, preview } = action.payload
    if (mimeType === 'application/pdf' && !preview) {
      yield put(Actions.pdfReaderSucceeded(dataUrl, uuid))
    }
  } catch (err) {
    yield put(Actions.pdfReaderFailed(err))
  }
}

function* pop() {
  yield put(NavAction.pop())
}

function* push({ payload: { uuid } }: any) {
  try {
    if (Platform.OS === 'ios') {
      yield put(NavAction.push('pdfreader', { uuid }))
    } else {
      const token = yield call(checkAndGetTokenAsync)
      const isPreview = false
      const url = CommonApi.getMediaUrl(uuid, isPreview, Env.api.base, token)
      // const canOpenUrl = yield call(canOpenURLAsync, url)
      yield put(Actions.stopLoader(uuid))
      yield put(NavAction.push('pdfreader', { url }))
    }
  } catch (error) {
    yield put(Actions.pdfReaderFailed(error))
  }
}

function* fetchPreview(action: any) {
  try {
    const preview = true
    yield getMedia(action, preview)
  } catch (err) {
    yield put(Actions.pdfReaderPreviewFailed(err))
  }
}

function* showPreview(action: any) {
  try {
    const { mimeType, uuid, preview, dataUrl } = action.payload
    if (mimeType === 'application/pdf' && preview) {
      yield put(Actions.pdfReaderPreviewSucceeded(dataUrl, uuid))
    }
  } catch (error) {
    yield put(Actions.pdfReaderPreviewFailed(error))
  }
}

export default [
  takeEvery(ActionTypes.PDFREADER_REQUESTED, fetchPdfReader),
  takeEvery(ActionTypes.PDFREADER_PREVIEW_REQUESTED, fetchPreview),
  takeEvery(ActionTypes.PDFREADER_POP, pop),
  takeEvery(ActionTypes.PDFREADER_PUSH, push),
  takeEvery(messagingActionTypes.GET_MEDIA_RESOURCE_SUCCEEDED, goToPdfReader),
  takeEvery(messagingActionTypes.GET_MEDIA_RESOURCE_SUCCEEDED, showPreview),
]
