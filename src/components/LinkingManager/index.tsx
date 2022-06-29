import { useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'

import { useCallbackOne } from 'use-memo-one'

import ChatActions from 'screens/Chat/Chat.actions'
import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'
import pathOr from 'ramda/es/pathOr'

const URL_TO_FETCH = '/rest/user/api/users/onboarding'
const URL_TO_OPEN_IN_BROWSER = '/rest/messaging/api/videochat/callback/redirect'
const URL_TO_CHAT = '/private/app/messages/conversation/'

const conversationRegexp = /\/private\/app\/messages\/conversation\/([\d]*).*/
const isLoggedIn = pathOr(false, ['login', 'isLoggedIn'])
const isLoading = pathOr(false, ['loadingStack', 'isLoading'])

const handleLinkingEvent = (
  isUserLogged: boolean,
  dispatch: Dispatch,
) => (event: { url?: string | null }) => {
  const { url } = event
  if (url) {
    if (url.includes(URL_TO_FETCH)) {
      fetch(url)
        .then((r: Response) => console.log(`onboarding ${r.status}`))
        .catch(console.error)
    } else if (url.includes(URL_TO_OPEN_IN_BROWSER)) {
      if (isUserLogged) {
        dispatch(ChatActions.goToVideoChatRequested(url))
      }
    } else if (url.includes(URL_TO_CHAT)) {
      const matched = url.match(conversationRegexp)
      if (matched && matched[1]) {
        const conversationId = Number(matched[1])
        dispatch(ConversationsListActions.gotoChatRequested(conversationId))
      }
    }
  }
}

type Status =
  | 'WaitUntilStateIsTotallyLoaded'
  | 'StateIsLoaded'
  | 'AlreadyGetInitialURL'
export function LinkingManager() {
  const [status, updateStatus] = useState<Status>(
    'WaitUntilStateIsTotallyLoaded',
  )
  const dispatch = useDispatch()
  const isUserLogged = useSelector(isLoggedIn)
  const isStateLoaded = useSelector(isLoading)
  const handleLinking = useCallbackOne(
    handleLinkingEvent(isUserLogged, dispatch),
    [],
  )
  useEffect(() => {
    if (status !== 'AlreadyGetInitialURL') {
      if (isStateLoaded) {
        updateStatus('StateIsLoaded')
      } else {
        updateStatus('WaitUntilStateIsTotallyLoaded')
      }
    }
  }, [isStateLoaded])

  useEffect(() => {
    if (status !== 'AlreadyGetInitialURL') {
      Linking.getInitialURL()
        .then((url: string | null) => {
          updateStatus('AlreadyGetInitialURL')
          handleLinking({ url })
        })
        .catch(console.error)
    }
  }, [status])

  useEffect(() => {
    Linking.addEventListener('url', handleLinking)
    return () => Linking.removeEventListener('url', handleLinking)
  }, [])
  return null
}
