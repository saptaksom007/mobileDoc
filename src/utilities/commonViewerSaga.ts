import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import { put } from 'redux-saga/effects'

export function* getMedia(action: any, preview: boolean): any {
  const { mediaResource } = action.payload
  yield put({
    ...messagingActions.getMediaResourceRequested(
      mediaResource.uuid,
      preview,
      mediaResource.mimeType,
    ),
  })
}
