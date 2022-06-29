import { MediaResource } from 'api/types'

export const ActionTypes = {
  PHOTOVIEWER_REQUESTED: 'PHOTOVIEWER_REQUESTED',
  PHOTOVIEWER_SUCCEEDED: 'PHOTOVIEWER_SUCCEEDED',
  PHOTOVIEWER_FAILED: 'PHOTOVIEWER_FAILED',
  PHOTOVIEWER_PREVIEW_REQUESTED: 'PHOTOVIEWER_PREVIEW_REQUESTED',
  PHOTOVIEWER_PREVIEW_SUCCEEDED: 'PHOTOVIEWER_PREVIEW_SUCCEEDED',
  PHOTOVIEWER_PREVIEW_FAILED: 'PHOTOVIEWER_PREVIEW_FAILED',
  PHOTOVIEWER_POP: 'PHOTOVIEWER_POP',
  LOCAL_PHOTO_CACHED: 'LOCAL_PHOTO_CACHED',
  NAVIGATE_TO_PHOTO_VIEWER: 'NAVIGATE_TO_PHOTO_VIEWER',
}

export default class Actions {
  static photoViewerRequested(mediaResource: MediaResource) {
    return {
      type: ActionTypes.PHOTOVIEWER_REQUESTED,
      payload: { mediaResource },
    }
  }
  static photoViewerSucceeded(dataUrl: string, uuid: string) {
    return {
      type: ActionTypes.PHOTOVIEWER_SUCCEEDED,
      payload: { dataUrl, uuid },
    }
  }
  static photoViewerFailed(error: Error) {
    return {
      type: ActionTypes.PHOTOVIEWER_FAILED,
      payload: {
        error,
      },
    }
  }
  static photoViewerPreviewRequested(mediaResource: any) {
    return {
      type: ActionTypes.PHOTOVIEWER_PREVIEW_REQUESTED,
      payload: { mediaResource },
    }
  }
  static photoViewerPreviewSucceeded(
    dataUrl: string,
    uuid: string,
    timestamp?: number,
  ) {
    return {
      type: ActionTypes.PHOTOVIEWER_PREVIEW_SUCCEEDED,
      payload: { dataUrl, uuid, timestamp },
    }
  }
  static photoViewerPreviewFailed(error: Error) {
    return {
      type: ActionTypes.PHOTOVIEWER_PREVIEW_FAILED,
      payload: {
        error,
      },
    }
  }
  static photoViewerPop() {
    return {
      type: ActionTypes.PHOTOVIEWER_POP,
      payload: undefined,
    }
  }
  static localPhotoCached() {
    return {
      type: ActionTypes.LOCAL_PHOTO_CACHED,
    }
  }
  static navigateToPhotoViewer(mediaResource: MediaResource | string) {
    return {
      type: ActionTypes.NAVIGATE_TO_PHOTO_VIEWER,
      payload: mediaResource,
    }
  }
}
