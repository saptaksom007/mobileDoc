#!/usr/bin/env node

/* eslint-disable */

const { pipe, curry, tap } = require('ramda')
const pkg = require('../package.json')

const { BRANCH_NAME, EXP_ENV, BUILD_NUMBER } = process.env

const DEFAULT_VERSION = '0.0.0'

const PRODUCTION_ENV = 'production'
const STAGE_ENV = 'stage'
const QA_ENV = 'qa'
const IT_ENV = 'it'
const DEMO_ENV = 'demo1'

const SUFFIX_ENV = '_environment'

const DEVELOP_BRANCH = 'develop'
const PRODUCTION_BRANCH = `${PRODUCTION_ENV}${SUFFIX_ENV}`
const MASTER_BRANCH = 'master'

const out = val => (!BUILD_NUMBER ? val : console.log(val))

const getChannel = curry((env, branchName) => {
  if (env.includes('demo')) {
    return env
  }
  if (branchName === DEVELOP_BRANCH) {
    if (env === QA_ENV) {
      return QA_ENV
    }
    return IT_ENV
  } else if (branchName === 'e2e') {
    return QA_ENV
  } else if (
    branchName.startsWith('feature/') ||
    branchName.startsWith('hotfix/')
  ) {
    return branchName.replace(/\//gi, '_')
  } else if (branchName.startsWith('release/')) {
    return STAGE_ENV
  } else if (branchName === MASTER_BRANCH) {
    return PRODUCTION_ENV
  } else {
    throw new Error(`Could not process this branch name: ${branchName}`)
  }
})

const concatVersion = curry((version, channel) => `${channel}-v${version}`)

const concatBuildNumber = curry(
  (buildNumber, channel) => `${channel}-${buildNumber}`,
)

const isProduction = (env = EXP_ENV) => env === PRODUCTION_ENV

const isStage = (env = EXP_ENV) => env === STAGE_ENV

const isDemo = (env = EXP_ENV) => env === DEMO_ENV

const isQa = (env = EXP_ENV) => env === QA_ENV

const getChannelWithVersionAndBuildNumber = (
  branch = DEVELOP_BRANCH,
  version = DEFAULT_VERSION,
  env = QA_ENV,
  buildNumber = 0,
) => {
  if (isProduction(env) || branch === MASTER_BRANCH) {
    return PRODUCTION_ENV
  }

  if (isStage(env)) {
    return STAGE_ENV
  }

  if (isDemo(env)) {
    return DEMO_ENV
  }

  if (isQa(env) && branch === DEVELOP_BRANCH) {
    return QA_ENV
  }

  return pipe(
    getChannel(env),
    concatVersion(version),
    concatBuildNumber(buildNumber),
  )(branch)
}

// Main =>
out(
  getChannelWithVersionAndBuildNumber(
    BRANCH_NAME || DEVELOP_BRANCH,
    pkg.version || DEFAULT_VERSION,
    EXP_ENV || QA_ENV,
    BUILD_NUMBER || 0,
  ),
)

// export for unit tests =>
module.exports = {
  getChannel,
  concatVersion,
  concatBuildNumber,
  isProduction,
  getChannelWithVersionAndBuildNumber,
}
