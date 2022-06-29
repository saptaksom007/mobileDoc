import { Env } from 'env'
import { pathOr } from 'ramda'
import semver from 'semver'
import app from '../../app.json'
import Constants from 'expo-constants'

export const getVersion = ({ version, buildNumber, channel }: any = Env) =>
  `v${version}-${Constants.manifest.publishedTime}-${buildNumber}-${channel ||
    'default'}`

export const getDisplayVersion = ({ channel }: any = Env) =>
  `${channel || 'default'}`

export const simpleVersion = () => pathOr('1.0.0', ['expo', 'version'], app)

export const hasMinVersion = semver.lte
