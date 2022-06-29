import { NavigationService } from '../NavigationService'

const actions: any[] = []
const alerts: any[] = []

jest.mock('api', () => ({
  APIContext: {
    store: {
      getState() {
        return {
          navigation: {
            routeName: 'testRoute',
          },
        }
      },
    },
  },
}))

jest.mock('react-navigation', () => ({
  NavigationActions: {
    navigate: ({ routeName, params }: any) => ({
      type: 'navigate',
      routeName,
      params,
    }),
  },
  StackActions: {
    push: ({ routeName, params }: any) => ({
      type: 'push',
      routeName,
      params,
    }),
    pop: ({ n }: any) => ({
      type: 'pop',
      n,
    }),
    popToTop: ({ immediate }: any) => ({ type: 'popToTop', immediate }),
    reset: (routes: any) => routes,
  },
}))

beforeAll(() => {
  NavigationService.setTopLevelNavigator({
    dispatch: (action: any) => actions.push(action),
  })
  NavigationService.setAlert({
    alertWithType: (type: any, title: any, message: any) =>
      alerts.push({ type, title, message }),
  })
})

const last = (arr: any) => arr[arr.length - 1]

describe('NavigationService', () => {
  it('navigate', () => {
    const testRoute = 'testRoute'
    const testParams = { testParams: 'testValue' }
    NavigationService.navigate(testRoute, testParams)
    expect(last(actions)).toEqual({
      type: 'navigate',
      routeName: testRoute,
      params: testParams,
    })
  })
  it('push', () => {
    const testRoute = 'testRoute'
    const testParams = { testParams: 'testValue' }
    NavigationService.push(testRoute, testParams)
    expect(last(actions)).toEqual({
      type: 'push',
      routeName: testRoute,
      params: testParams,
    })
  })
  it('pop', () => {
    NavigationService.pop()
    expect(last(actions)).toEqual({
      type: 'pop',
      n: 1,
    })
  })
  it('popToTop', () => {
    NavigationService.popToTop()
    expect(last(actions)).toEqual({
      type: 'popToTop',
      immediate: true,
    })
  })
  // it('getCurrentRoute', () => {
  //   expect(NavigationService.getCurrentRoute()).toEqual('testRoute')
  // })
  it('showLocalAlert', () => {
    NavigationService.showLocalAlert('testAlertMessage', {
      type: 'error',
      title: 'Error',
    })
    expect(last(alerts)).toEqual({
      type: 'error',
      title: 'Error',
      message: 'testAlertMessage',
    })
  })
  it('reset', () => {
    NavigationService.reset(['route1', 'route2'])
    expect(last(actions)).toEqual({
      actions: [
        { params: undefined, routeName: 'route1', type: 'navigate' },
        { params: undefined, routeName: 'route2', type: 'navigate' },
      ],
      index: 1,
    })
  })
})
