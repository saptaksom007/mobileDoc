#!/usr/bin/env node
/* eslint no-console: 0 */

const compose = require('ramda/src/compose')
const propOr = require('ramda/src/propOr')
const propEq = require('ramda/src/propEq')
const prop = require('ramda/src/prop')
const sortWith = require('ramda/src/sortWith')
const descend = require('ramda/src/descend')
const pluck = require('ramda/src/pluck')
const filter = require('ramda/src/filter')
const head = require('ramda/src/head')
const { then, catchP } = require('./api_utils')

const { PROJECT_DATA, getLastVersionAsync } = require('./version_utils')

// eslint-disable-next-line
const [_, __, env, deviceType] = process.argv

const getLastPublicationId = (channel = 'stage', platform = 'ios') =>
  compose(
    catchP(e => {
      throw e
    }),
    then(head),
    then(Array.from),
    then(arr => new Set(arr)),
    then(pluck('publicationId')),
    then(sortWith([descend(prop('publishedTime'))])),
    then(filter(propEq('platform', platform))),
    then(filter(propEq('channel', channel))),
    then(propOr([], 'queryResult')),
    getLastVersionAsync,
  )(PROJECT_DATA)

// main
;(async function main() {
  try {
    const result = await getLastPublicationId(env, deviceType)
    console.log(result)
  } catch (error) {
    console.log(error.message, error)
    process.exit(1)
  }
})()
