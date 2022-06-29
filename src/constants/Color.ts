import { Platform } from 'react-native'

const tintColor = 'rgba(27, 106, 158, 0.85)'
const primaryColor = '#ccc'

export const Color = {
  blueDD: '#223540',
  blueD: '#4C748c',
  blue: '#679EBF',
  blueL: '#AABDCA',
  white: '#fff',
  primaryColor,
  tintColor,
  tintColorTTT: 'rgba(27, 106, 158, 0.5)',
  tabIconDefault: '#888',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: '#d9534f',
  errorText: '#fff',
  warningBackground: '#f0ad4e',
  warningText: '#fff',
  noticeBackground: '#5bc0de',
  noticeText: '#fff',
  lightText: '#999',
  darkText: tintColor,
  borderColor: '#E7ECEE',
  lightBackground: '#fff',
  darkBackground: primaryColor,
  black: '#363c40',
  blackTT: 'rgba(0, 0, 0, 0.4)',
  blackTTT: 'rgba(0, 0, 0, 0.2)',
  blackTTTT: 'rgba(0, 0, 0, 0.1)',
  dev: '#dae',
  it: '#92B3E4',
  qa: '#F7815E',
  stage: '#F4D91A',
  production: Platform.select({ ios: 'transparent', android: tintColor }),
  demo1: Platform.select({ ios: 'transparent', android: tintColor }),
  demo2: Platform.select({ ios: 'transparent', android: tintColor }),
  gradientBlue: '#cee3f9',
  gradientBlueL: '#ddedfa',
  gradientBlueLL: '#feffff',
  green: 'green',
  orange: 'orange',
  yellow: 'yellow',
  bluePrimary: '#1a7dae',
  purple: '#8950b6',
}