import {
  viewerRequested,
  viewerFailed,
  viewerPop,
  viewerPreviewRequested,
  viewerPreviewSucceeded,
  initialState
} from 'utilities/commonViewerReducer'

import { ActionTypes } from './PdfReader.actions'

const {
  PDFREADER_REQUESTED,
  PDFREADER_SUCCEEDED,
  PDFREADER_FAILED,
  PDFREADER_PREVIEW_REQUESTED,
  PDFREADER_PREVIEW_SUCCEEDED,
  PDFREADER_POP,
  PDFREADER_STOP_LOADER
} = ActionTypes

interface Action {
  type: keyof typeof ActionTypes
  payload?: any
}

export default function pdfreader(state: any = initialState, action: Action) {
  switch (action.type) {
    case PDFREADER_REQUESTED: {
      return viewerRequested(state, action)
    }

    case PDFREADER_SUCCEEDED: {
      return {
        ...state,
        loading: false,
        dataUrl: action.payload.dataUrl,
        previews: {
          ...state.previews,
          [action.payload.uuid || 'undefined']: {
            loading: false,
            dataUrl: action.payload.dataUrl
          }
        }
      }
    }

    case PDFREADER_FAILED: {
      return viewerFailed(state)
    }

    case PDFREADER_PREVIEW_REQUESTED: {
      return viewerPreviewRequested(state, action)
    }

    case PDFREADER_PREVIEW_SUCCEEDED: {
      return viewerPreviewSucceeded(state, action)
    }

    case PDFREADER_POP: {
      return viewerPop(state)
    }

    case PDFREADER_STOP_LOADER: {
      return {
        ...state,
        loading: false,
        previews: {
          ...state.previews,
          [action.payload.uuid || 'default']: {
            ...state.previews[action.payload.uuid],
            loading: false
          }
        }
      }
    }

    default:
      return state
  }
}
