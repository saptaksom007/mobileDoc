import { Buffer } from 'buffer'
import * as ImagePicker from 'expo-image-picker';
import { call, put, takeLatest } from 'redux-saga/effects'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import { healthrelationActions } from 'common-docdok/lib/domain/healthrelation/actions'
import {
  resizePicture,
  getExpoPickerFromPickerTypeAsync,
  getImagePickerFromIndex,
} from 'utilities/image'
import i18n from 'ex-react-native-i18n'
import { asyncAction } from 'common-docdok/lib/utils/sagaUtils'

import Actions, { ActionTypes } from './DossierDetail.actions'

function* failed(err: Error) {
  yield put(Actions.updateRelativePhotoFailed(err))
  yield put(NavAction.showLocalError(i18n.t('profile.errors.updateAvatar')))
}

function* updateRelativePhoto({ payload: { pictureFrom, patientUuid } }: any) {
  try {
    const launchPickerAsync = yield call(
      getExpoPickerFromPickerTypeAsync,
      getImagePickerFromIndex(pictureFrom),
    )
    const resultPicker = yield call(launchPickerAsync, {
      aspect: [1, 1],
      base64: true,
      quality: 0.6,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    })
    if (resultPicker.cancelled) {
      yield put(Actions.updateRelativePhotoCancelled())
    } else {
      const { base64 } = yield call(resizePicture, resultPicker)
      const winner = yield asyncAction(
        healthrelationActions.uploadPatientAvatarRequested(
          patientUuid,
          new Buffer(base64, 'base64'),
        ),
      )
      if (!winner.succeeded) {
        yield failed(winner.failed.payload.error)
      } else {
        yield put(Actions.updateRelativePhotoSucceeded())
      }
    }
  } catch (err) {
    yield failed(err)
  }
}

export default [
  takeLatest(ActionTypes.UPDATE_RELATIVE_PHOTO_REQUESTED, updateRelativePhoto),
]
