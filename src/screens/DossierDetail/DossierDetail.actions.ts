export const ActionTypes = {
  UPDATE_RELATIVE_PHOTO_REQUESTED: 'UPDATE_RELATIVE_PHOTO_REQUESTED',
  UPDATE_RELATIVE_PHOTO_SUCCEEDED: 'UPDATE_RELATIVE_PHOTO_SUCCEEDED',
  UPDATE_RELATIVE_PHOTO_FAILED: 'UPDATE_RELATIVE_PHOTO_FAILED',
  UPDATE_RELATIVE_PHOTO_CANCELLED: 'UPDATE_RELATIVE_PHOTO_CANCELLED'
}

export default class Actions {
  static updateRelativePhotoRequested(
    pictureFrom: number,
    patientUuid: string
  ) {
    return {
      type: ActionTypes.UPDATE_RELATIVE_PHOTO_REQUESTED,
      payload: { pictureFrom, patientUuid }
    }
  }
  static updateRelativePhotoSucceeded() {
    return {
      type: ActionTypes.UPDATE_RELATIVE_PHOTO_SUCCEEDED
    }
  }
  static updateRelativePhotoCancelled() {
    return {
      type: ActionTypes.UPDATE_RELATIVE_PHOTO_CANCELLED
    }
  }
  static updateRelativePhotoFailed(error: Error) {
    return {
      type: ActionTypes.UPDATE_RELATIVE_PHOTO_FAILED,
      payload: {
        message: error.message,
        error
      }
    }
  }
}
