import {
  viewerRequested,
  viewerFailed,
  viewerSucceeded,
  viewerPop,
  viewerPreviewRequested,
  viewerPreviewSucceeded,
  initialState
} from 'utilities/commonViewerReducer'

import { ActionTypes } from './PhotoViewer.actions'
import { Action } from 'redux'

const {
  PHOTOVIEWER_REQUESTED,
  PHOTOVIEWER_SUCCEEDED,
  PHOTOVIEWER_FAILED,
  PHOTOVIEWER_PREVIEW_REQUESTED,
  PHOTOVIEWER_PREVIEW_SUCCEEDED,
  PHOTOVIEWER_POP
} = ActionTypes

export default function photoviewer(state: any = initialState, action: Action) {
  switch (action.type) {
    case PHOTOVIEWER_REQUESTED: {
      return viewerRequested(state, action)
    }

    case PHOTOVIEWER_SUCCEEDED: {
      return viewerSucceeded(state, action)
    }

    case PHOTOVIEWER_FAILED: {
      return viewerFailed(state)
    }

    case PHOTOVIEWER_PREVIEW_REQUESTED: {
      return viewerPreviewRequested(state, action)
    }

    case PHOTOVIEWER_PREVIEW_SUCCEEDED: {
      return viewerPreviewSucceeded(state, action)
    }

    case PHOTOVIEWER_POP: {
      return viewerPop(state)
    }

    default:
      return state
  }
}
