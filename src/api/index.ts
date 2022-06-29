/**
 * API Context:
 * If you need to dispatch some actions into the store,
 * use it like APIContext.store.dispatch({type: 'AN_ACTION'}).
 *
 * Also keep expireAuthTimeoutID number for next authentication.
 */
export class APIContext {
  static store: any = null
  static expireAuthTimeoutID: any
}
