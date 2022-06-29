import { StyleSheet, Platform } from 'react-native'

export const DEFAULT_SIZE = Platform.select({ ios: 45, android: 42 })

export const colors = [
  '#e67e22',
  '#2ecc71',
  '#3498db',
  '#8e44ad',
  '#f1c40f',
  '#e74c3c',
  '#c0392b',
  '#1abc9c',
  '#f39c12',
  '#7f8c8d'
]

export default StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE
  }
})
