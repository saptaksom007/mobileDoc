import { NavigationActions, StackActions } from 'react-navigation'

let navigatorRef: any
let alertRef: {
  alertWithType?(type: string, title?: string, message?: string): void
} | null

function setTopLevelNavigator(ref: any | null) {
  if (ref) {
    navigatorRef = ref
  }
}

function setAlert(ref: any | null) {
  if (ref) {
    alertRef = ref
  }
}

function navigate(routeName: string, params: any) {
  if (navigatorRef) {
    navigatorRef.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    )
  }
}

function push(routeName: string, params: any) {
  if (navigatorRef) {
    navigatorRef.dispatch(
      StackActions.push({
        routeName,
        params,
      }),
    )
  }
}

function pop() {
  if (navigatorRef) {
    navigatorRef.dispatch(
      StackActions.pop({
        n: 1,
      }),
    )
  }
}

function popToTop() {
  if (navigatorRef) {
    navigatorRef.dispatch(StackActions.popToTop({ immediate: true }))
  }
}

function getCurrentRoute() {
  if (navigatorRef) {
    let route = navigatorRef.state.nav
    while (route.routes) {
      route = route.routes[route.index]
    }
    return route.routeName
  }

  return null
}

function showLocalAlert(message: string, options: any) {
  if (alertRef && alertRef.alertWithType) {
    alertRef.alertWithType(options.type, options.title, message)
  }
}

function reset(routeNames: string[]) {
  const resetAction = StackActions.reset({
    index: routeNames.length - 1,
    actions: routeNames.map((routeName: any) =>
      NavigationActions.navigate({ routeName }),
    ),
  })
  if (navigatorRef) {
    navigatorRef.dispatch(resetAction)
  }
}

export const NavigationService = {
  navigate,
  pop,
  popToTop,
  getCurrentRoute,
  push,
  setTopLevelNavigator,
  showLocalAlert,
  reset,
  setAlert,
}
