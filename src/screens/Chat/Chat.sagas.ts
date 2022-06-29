import {
  put,
  call,
  select,
  takeEvery,
  take,
  takeLatest,
} from 'redux-saga/effects'
import { Keyboard, Platform, StatusBar, Linking } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { pathOr, path, pipe } from 'ramda'
import {
  getExpoPickerFromPickerTypeAsync,
  resizePicture,
} from 'utilities/image'
import { Buffer } from 'buffer'

import * as ImagePicker from 'expo-image-picker'

import { api } from 'common-docdok'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import { NavigationService } from 'navigation/NavigationService'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { ActionTypes as PhotoViewerActionTypes } from 'screens/PhotoViewer/PhotoViewer.actions'
import i18n from 'ex-react-native-i18n'
import { getSurveyUrlById } from 'utilities/survey'

import NotificationsActions, {
  ActionTypes as NotifActionTypes,
} from 'notifications/actions'
import Actions, { ActionTypes } from './Chat.actions'
import { fetchForceGetRedirectAsync } from 'api/conversations'

const getSelectedConversation = pipe(
  path(['messaging', 'selectedConversation']),
  Number,
)
const isLoggedInSelector = pathOr(false, ['login', 'isLoggedIn'])
const getRefreshTokenExpireIn = pathOr(0, ['login', 'refresh_token_expire_in'])

function* loadMessages() {
  try {
    // If logged in before load messages
    const isLoggedIn: boolean = yield select(isLoggedInSelector)
    const refreshTokenExpireIn: number = yield select(getRefreshTokenExpireIn)
    if (isLoggedIn || Date.now() < refreshTokenExpireIn) {
      const routeName = NavigationService.getCurrentRoute()
      const conversationId = yield select(getSelectedConversation)
      if (conversationId && routeName === 'chat') {
        yield put(messagingActions.loadMessagesRequested(conversationId))
        yield put(NotificationsActions.removeNotificationRequested())
      }
    }
  } catch (error) {
    yield put(Actions.loadMessagesFailed(error))
    yield put(NavAction.showLocalError(i18n.t('chat.errors.loadMessages')))
  }
}

function* addPhoto({ payload: { imageFrom } }: any) {
  try {
    Keyboard.dismiss()
    const launchPickerAsync = yield call(
      getExpoPickerFromPickerTypeAsync,
      imageFrom,
    )
    const resultPicker = yield call(launchPickerAsync, {
      quality: 0.6,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS !== 'ios',
    })

    if (resultPicker.cancelled) {
      yield put(Actions.addPhotoCancelled())
    } else {
      const mimeTypeString = 'image/png'
      const { base64, uri } = yield call(resizePicture, resultPicker)
      const conversationId = yield select(getSelectedConversation)
      const response = yield call(
        api.uploadRequest,
        mimeTypeString,
        conversationId,
      )
      const { mediaResourceId, url } = response.data
      yield call(
        api.uploadFile,
        url,
        mimeTypeString,
        new Buffer(base64, 'base64'),
      )

      yield put(Actions.addPhotoSucceeded(uri, mediaResourceId, base64))

      yield take(PhotoViewerActionTypes.LOCAL_PHOTO_CACHED)

      yield put(
        messagingActions.postMessageRequested(conversationId, 'Image 📷', {
          mediaResourceId,
          preview: url,
          mimeType: mimeTypeString,
          originalSize: base64.length,
        }),
      )
    }
  } catch (error) {
    yield put(Actions.addPhotoFailed(error))
  }
}

function* goToSurveySaga({ payload: surveyId }: any) {
  try {
    const surveyLink = yield call(getSurveyUrlById, surveyId)
    yield put(
      NavAction.push('surveywebview', { url: surveyLink, goBack: true }),
    )
    yield put(Actions.goToSurveySucceeded())
  } catch (error) {
    yield put(Actions.goToSurveyFailed(error))
  }
}

function* goToVideoChat({ payload: videoChatUrlRedirect }: any) {
  try {
    const videoChatUrl = yield call(
      fetchForceGetRedirectAsync,
      videoChatUrlRedirect,
    )
    if (videoChatUrl) {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(true, 'fade')
        yield call(WebBrowser.openBrowserAsync, videoChatUrl)
        StatusBar.setHidden(false, 'fade')
      } else {
        Linking.openURL(videoChatUrl)
      }
    } else {
      yield put(Actions.goToVideoChatFailed(new Error('Link expired')))
    }

    yield put(Actions.goToVideoChatSucceeded())
  } catch (error) {
    yield put(Actions.goToVideoChatFailed(error))
  }
}

export default [
  takeEvery(ActionTypes.ADD_PHOTO_REQUESTED, addPhoto),
  takeEvery(NotifActionTypes.ADD_NOTIFICATION_SUCCEEDED, loadMessages),
  takeLatest(ActionTypes.GO_TO_SURVEY_REQUESTED, goToSurveySaga),
  takeLatest(ActionTypes.GO_TO_VIDEO_CHAT_REQUESTED, goToVideoChat),
]
