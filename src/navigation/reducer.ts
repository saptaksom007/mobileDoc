interface State {
  routeName?: string
  pushAuthView?: boolean
}

interface Action {
  type: 'NAV_OK' | 'NAV_PUSH' | 'ON_TRANSITION_END'
  payload?: string
  route: string
}

const initialState: State = {
  routeName: undefined,
  pushAuthView: false,
}

export default function nav(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'NAV_PUSH': {
      if (action.route === 'Auth') {
        return { ...state, pushAuthView: true }
      }
      return { ...state, pushAuthView: false }
    }
    case 'ON_TRANSITION_END':
      return { ...state, routeName: action.route }

    default:
      return state
  }
}
