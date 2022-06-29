import { ActionTypes } from './Graphic.actions'

const { GRAPHIC_REQUESTED, GRAPHIC_SUCCEEDED, GRAPHIC_FAILED } = ActionTypes

interface State {
  data: any[]
}

interface Action {
  type: keyof typeof ActionTypes
  payload: any
}

const initialState: State = {
  data: [],
}

export default function graphic(state: State = initialState, action: Action) {
  switch (action.type) {
    case GRAPHIC_REQUESTED: {
      return { ...state }
    }

    case GRAPHIC_SUCCEEDED: {
      return { ...state, data: action.payload }
    }

    case GRAPHIC_FAILED: {
      return { ...state }
    }

    default:
      return state
  }
}
