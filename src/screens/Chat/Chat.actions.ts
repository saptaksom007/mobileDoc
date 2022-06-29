import { picker } from 'api/types'

export const ActionTypes = {
  ADD_PHOTO_REQUESTED: 'ADD_PHOTO_REQUESTED',
  ADD_PHOTO_SUCCEEDED: 'ADD_PHOTO_SUCCEEDED',
  ADD_PHOTO_FAILED: 'ADD_PHOTO_FAILED',
  ADD_PHOTO_CANCELLED: 'ADD_PHOTO_CANCELLED',
  LOAD_MESSAGES_FAILED: 'LOAD_MESSAGES_FAILED',
  GO_TO_SURVEY_REQUESTED: 'GO_TO_SURVEY_REQUESTED',
  GO_TO_SURVEY_SUCCEEDED: 'GO_TO_SURVEY_SUCCEEDED',
  GO_TO_SURVEY_FAILED: 'GO_TO_SURVEY_FAILED',
  GO_TO_VIDEO_CHAT_REQUESTED: 'GO_TO_VIDEO_CHAT_REQUESTED',
  GO_TO_VIDEO_CHAT_SUCCEEDED: 'GO_TO_VIDEO_CHAT_SUCCEEDED',
  GO_TO_VIDEO_CHAT_FAILED: 'GO_TO_VIDEO_CHAT_FAILED',
}

export default class Actions {
  static addPhotoRequested(imageFrom: picker) {
    return {
      type: ActionTypes.ADD_PHOTO_REQUESTED,
      payload: { imageFrom },
    }
  }
  static addPhotoSucceeded(
    uri: string,
    mediaResourceId: string,
    dataUri?: string,
  ) {
    return {
      type: ActionTypes.ADD_PHOTO_SUCCEEDED,
      payload: {
        uri,
        mediaResourceId,
        dataUri,
      },
    }
  }
  static addPhotoFailed(error: Error) {
    return {
      type: ActionTypes.ADD_PHOTO_FAILED,
      message: error.message,
      error,
    }
  }
  static addPhotoCancelled() {
    return { type: ActionTypes.ADD_PHOTO_CANCELLED }
  }

  static loadMessagesFailed(error: Error) {
    return {
      type: ActionTypes.LOAD_MESSAGES_FAILED,
      message: error.message,
      error,
    }
  }
  static goToSurveyRequested(surveyId: number) {
    return {
      type: ActionTypes.GO_TO_SURVEY_REQUESTED,
      payload: surveyId,
    }
  }
  static goToSurveySucceeded() {
    return {
      type: ActionTypes.GO_TO_SURVEY_SUCCEEDED,
      payload: undefined,
    }
  }
  static goToSurveyFailed(error: Error) {
    return {
      type: ActionTypes.GO_TO_SURVEY_FAILED,
      payload: error,
    }
  }
  static goToVideoChatRequested(videoChatUrl: string) {
    return {
      type: ActionTypes.GO_TO_VIDEO_CHAT_REQUESTED,
      payload: videoChatUrl,
    }
  }
  static goToVideoChatSucceeded() {
    return {
      type: ActionTypes.GO_TO_SURVEY_SUCCEEDED,
      payload: undefined,
    }
  }
  static goToVideoChatFailed(error: Error) {
    return {
      type: ActionTypes.GO_TO_VIDEO_CHAT_FAILED,
      payload: error,
    }
  }
}
