export const ActionTypes = {
  PDFREADER_REQUESTED: 'PDFREADER_REQUESTED',
  PDFREADER_SUCCEEDED: 'PDFREADER_SUCCEEDED',
  PDFREADER_FAILED: 'PDFREADER_FAILED',
  PDFREADER_PREVIEW_REQUESTED: 'PDFREADER_PREVIEW_REQUESTED',
  PDFREADER_PREVIEW_SUCCEEDED: 'PDFREADER_PREVIEW_SUCCEEDED',
  PDFREADER_PREVIEW_FAILED: 'PDFREADER_PREVIEW_FAILED',
  PDFREADER_STOP_LOADER: 'PDFREADER_STOP_LOADER',
  PDFREADER_POP: 'PDFREADER_POP',
  PDFREADER_PUSH: 'PDFREADER_PUSH'
}

export default class Actions {
  static pdfReaderRequested(mediaResource: any) {
    return {
      type: ActionTypes.PDFREADER_REQUESTED,
      payload: { mediaResource }
    }
  }
  static pdfReaderSucceeded(dataUrl: string, uuid: string) {
    return {
      type: ActionTypes.PDFREADER_SUCCEEDED,
      payload: {
        dataUrl,
        uuid
      }
    }
  }
  static pdfReaderFailed(error: Error) {
    return {
      type: ActionTypes.PDFREADER_FAILED,
      payload: {
        error
      }
    }
  }
  static pdfReaderPreviewRequested(mediaResource: any) {
    return {
      type: ActionTypes.PDFREADER_PREVIEW_REQUESTED,
      payload: { mediaResource }
    }
  }
  static pdfReaderPreviewSucceeded(dataUrl: string, uuid: string) {
    return {
      type: ActionTypes.PDFREADER_PREVIEW_SUCCEEDED,
      payload: {
        dataUrl,
        uuid
      }
    }
  }
  static pdfReaderPreviewFailed(error: Error) {
    return {
      type: ActionTypes.PDFREADER_PREVIEW_FAILED,
      payload: {
        error
      }
    }
  }
  static pdfReaderPop() {
    return {
      type: ActionTypes.PDFREADER_POP,
      payload: undefined
    }
  }
  static pdfReaderPush(mediaResource: any) {
    return {
      type: ActionTypes.PDFREADER_PUSH,
      payload: mediaResource
    }
  }
  static stopLoader(uuid: string) {
    return {
      type: ActionTypes.PDFREADER_STOP_LOADER,
      payload: {
        uuid
      }
    }
  }
}
