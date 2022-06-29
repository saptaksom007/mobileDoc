import { picker } from 'api/types'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';

const { launchCameraAsync, launchImageLibraryAsync } = ImagePicker

const { CAMERA, CAMERA_ROLL } = Permissions

const MAX_IMG_SIZE = 1600

export default { MAX_IMG_SIZE }

const checkPermissionAsync = async (permission: Permissions.PermissionType) => {
  const { status } = await Permissions.getAsync(permission)
  return status === 'granted'
}

const askPermissionAsync = async (permission: Permissions.PermissionType) => {
  const { status } = await Permissions.askAsync(permission)
  if (status !== 'granted') {
    throw new Error(`${permission} permission not granted`)
  }
}

export const getExpoPickerFromPickerTypeAsync = async (from: string) => {
  switch (from) {
    case 'camera':
      if (!(await checkPermissionAsync(CAMERA))) {
        await askPermissionAsync(CAMERA)
      }
      if (!(await checkPermissionAsync(CAMERA_ROLL))) {
        await askPermissionAsync(CAMERA_ROLL)
      }
      return launchCameraAsync
    case 'library':
      if (!(await checkPermissionAsync(CAMERA_ROLL))) {
        await askPermissionAsync(CAMERA_ROLL)
      }
      return launchImageLibraryAsync
    default:
      throw new Error(`Unkown image source ${from}`)
  }
}

export const getImagePickerFromIndex = (from: number): picker => {
  switch (from) {
    case 0:
      return 'camera'
    case 1:
      return 'library'
    case 2:
      return 'pdf'
    default:
      return 'library'
  }
}

export const calculateBetterSize = (width: number, height: number) => {
  if (width < MAX_IMG_SIZE && height < MAX_IMG_SIZE) {
    return { width, height }
  }
  if (width > MAX_IMG_SIZE && height > MAX_IMG_SIZE) {
    if (width >= height) {
      return { width: MAX_IMG_SIZE }
    }
    return { height: MAX_IMG_SIZE }
  }
  if (width > MAX_IMG_SIZE) {
    return { width: MAX_IMG_SIZE }
  }

  return { height: MAX_IMG_SIZE }
}

export const resizePicture = async ({
  uri: image,
  width: actualWidth,
  height: actualHeight,
  base64: actualBase64
}: {
  uri: string
  width: number
  height: number
  base64: string
}) => {
  const base64 = true
  const format: 'jpeg' | any = 'jpeg'
  const compress = 0.2
  const saveOptions = {
    base64,
    format,
    compress
  }
  const resize = calculateBetterSize(actualWidth, actualHeight)
  const actions = [{ resize }]

  const {
    base64: result,
    uri: newUri
  } = await ImageManipulator.manipulateAsync(image, actions, saveOptions)

  return { base64: result || actualBase64, uri: newUri }
}
