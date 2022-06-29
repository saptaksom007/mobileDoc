export const ActionTypes = {
  APPOINTMENTSLIST_REQUESTED: 'APPOINTMENTSLIST_REQUESTED',
  APPOINTMENTSLIST_SUCCEEDED: 'APPOINTMENTSLIST_SUCCEEDED',
  APPOINTMENTSLIST_FAILED: 'APPOINTMENTSLIST_FAILED',
  APPOINTMENTSLIST_LOADED: 'APPOINTMENTSLIST_LOADED',
}

export default class Actions {
  static appointmentsListRequested(addPhysicianAvatars: boolean = true) {
    return {
      type: ActionTypes.APPOINTMENTSLIST_REQUESTED,
      payload: {
        addPhysicianAvatars,
      },
    }
  }
  static appointmentsListSucceeded(rawList: object[]) {
    return {
      type: ActionTypes.APPOINTMENTSLIST_SUCCEEDED,
      payload: {
        rawList,
      },
    }
  }
  static appointmentsListFailed(error: Error) {
    return {
      type: ActionTypes.APPOINTMENTSLIST_FAILED,
      payload: {
        error,
      },
    }
  }
  static appointmentslistLoaded() {
    return {
      type: ActionTypes.APPOINTMENTSLIST_LOADED,
    }
  }
}
