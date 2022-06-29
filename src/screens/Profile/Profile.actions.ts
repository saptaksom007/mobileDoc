export const ActionTypes = {
  UPDATE_AVATAR_REQUESTED: 'UPDATE_AVATAR_REQUESTED',
  UPDATE_AVATAR_SUCCEEDED: 'UPDATE_AVATAR_SUCCEEDED',
  UPDATE_AVATAR_FAILED: 'UPDATE_AVATAR_FAILED',
}

export default class Actions {
  static updateAvatarRequested(pictureFrom: number) {
    return { type: ActionTypes.UPDATE_AVATAR_REQUESTED, pictureFrom }
  }
  static updateAvatarSucceeded() {
    return {
      type: ActionTypes.UPDATE_AVATAR_SUCCEEDED,
    }
  }
  static updateAvatarFailed(error: Error) {
    return {
      type: ActionTypes.UPDATE_AVATAR_FAILED,
      payload: {
        error,
      },
    }
  }
}
