export interface PreviewType {
  [uuid: string]: {
    loading: boolean
    dataUrl: string
    timestamp?: number
  }
}

export const initialState = {
  dataUrl: undefined,
  loading: true,
  previews: {},
}

export function viewerRequested(state: any = initialState, action: any) {
  return {
    ...state,
    loading: true,
    error: undefined,
    previews: {
      ...state.previews,
      [action.payload.mediaResource.uuid || 'default']: {
        ...state.previews[action.payload.mediaResource.uuid],
        loading: true,
      },
    },
  }
}

export function viewerSucceeded(state: any = initialState, action: any) {
  return {
    ...state,
    dataUrl: action.payload.dataUrl,
    loading: false,
    previews: {
      ...state.previews,
      [action.payload.uuid || 'default']: {
        dataUrl:
          action.payload.dataUrl &&
          action.payload.dataUrl.includes('application/pdf')
            ? state.previews[action.payload.uuid].dataUrl
            : action.payload.dataUrl,
        loading: false,
      },
    },
  }
}

export function viewerFailed(state = initialState) {
  return { ...state, dataUrl: undefined, loading: false }
}

export function viewerPreviewRequested(state = initialState, action: any) {
  return {
    ...state,
    previews: {
      ...state.previews,
      [action.payload.mediaResource.uuid || 'default']: {
        loading: true,
        dataUrl: undefined,
      },
    },
  }
}

export function viewerPreviewSucceeded(state = initialState, action: any) {
  return {
    ...state,
    loading: false,
    previews: {
      ...state.previews,
      [action.payload.uuid || 'default']: {
        loading: false,
        dataUrl: action.payload.dataUrl,
        timestamp: action.payload.timestamp,
      },
    },
  }
}

export function viewerPop(state: any = initialState) {
  return { ...state, dataUrl: undefined, loading: false }
}
