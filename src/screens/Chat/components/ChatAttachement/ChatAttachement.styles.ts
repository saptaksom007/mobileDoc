import { StyleSheet } from 'react-native'

const borderRadius = 13

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    borderRadius,
    minWidth: 200,
    maxHeight: 100,
  },
  loader: {
    zIndex: 10,
  },
  loaderContainer: {
    backgroundColor: 'transparent',
  },
  image: {
    minWidth: 200,
    height: 100,
    padding: 7,
    borderRadius,
    resizeMode: 'cover',
    width: '100%',
  },
  contentContainerStyle: {
    flex: 1,
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
  transformImageActive: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    height: 100,
    width: '100%',
    borderRadius,
    left: 3,
    top: 3,
    zIndex: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  fallback: {
    minWidth: 200,
    height: 100,
    padding: 7,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius,
  },
})
