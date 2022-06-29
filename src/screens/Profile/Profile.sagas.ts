import { Buffer } from 'buffer'
import * as ImagePicker from 'expo-image-picker';
import { call, put, takeLatest } from 'redux-saga/effects'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { Platform } from 'react-native'
import { userActions } from 'common-docdok/lib/domain/user/actions'
import {
  resizePicture,
  getExpoPickerFromPickerTypeAsync,
  getImagePickerFromIndex,
} from 'utilities/image'
import i18n from 'ex-react-native-i18n'
import { asyncAction } from 'common-docdok/lib/utils/sagaUtils'

import Actions, { ActionTypes } from './Profile.actions'

function* failed(err: Error) {
  yield put(Actions.updateAvatarFailed(err))
  yield put(NavAction.showLocalError(i18n.t('profile.errors.updateAvatar')))
}

function* updateAvatar({ pictureFrom }: any) {
  try {
    const launchPickerAsync = yield call(
      getExpoPickerFromPickerTypeAsync,
      getImagePickerFromIndex(pictureFrom),
    )
    const resultPicker = yield call(launchPickerAsync, {
      aspect: [1, 1],
      allowsEditing: true,
      quality: Platform.OS === 'android' ? 0.3 : 0.6,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    if (!resultPicker.cancelled) {
      const { base64 } = yield call(resizePicture, resultPicker)
      const winner = yield asyncAction(
        userActions.uploadAvatarRequested(new Buffer(base64, 'base64')),
      )
      if (!winner.succeeded) {
        yield failed(winner.failed.payload.error)
      } else {
        yield put(Actions.updateAvatarSucceeded())
      }
    }
  } catch (err) {
    yield failed(err)
  }
}

export default [takeLatest(ActionTypes.UPDATE_AVATAR_REQUESTED, updateAvatar)]
