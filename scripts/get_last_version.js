#!/usr/bin/env node

/* eslint no-console: 0 */

const compose = require('ramda/src/compose')
const curry = require('ramda/src/curry')
const tap = require('ramda/src/tap')
const propOr = require('ramda/src/propOr')
const pluck = require('ramda/src/pluck')
const filter = require('ramda/src/filter')
const groupBy = require('ramda/src/groupBy')
const head = require('ramda/src/head')
const evolve = require('ramda/src/evolve')
const { PROJECT_DATA, getLastVersionAsync } = require('./version_utils')

const api = require('../src/config/api.json')

// then :: f -> Thenable -> Thenable
const then = curry((f, thenable) => thenable.then(f))

// catchP :: f -> Promise -> Promise
const catchP = curry((f, promise) => promise.catch(f))

const styleString = color => `color: ${color}; font-weight: bold`

const log = tap(logThis =>
  console.log(
    '%c[ LOG ]\n',
    styleString('blue'),
    JSON.stringify(logThis, null, 2),
  ),
)

// log :: string -> Promise<*>
const logAsync = then(log)

const [_, __, env] = process.argv

const cleanChannels = channel =>
  Object.keys(api).reduce(
    (acc, next) =>
      acc ||
      channel === 'qa' ||
      (channel && channel.startsWith(`${next}-`) && !channel.startsWith(`qa-`)),
    false,
  )

const byEnv = channel => channel.split('-')[0]

const getHeads = Object.keys(api).reduce(
  (acc, next) => ({ ...acc, [next]: head }),
  {},
)

const getLast = environment =>
  compose(
    catchP(e => {
      throw e
    }),
    then(data => (environment ? data[environment] : JSON.stringify(data))),
    then(evolve(getHeads)),
    then(groupBy(byEnv)),
    then(filter(cleanChannels)),
    then(Array.from),
    then(arr => new Set(arr)),
    then(pluck('channel')),
    then(propOr([], 'queryResult')),
    getLastVersionAsync,
  )(PROJECT_DATA)

// main
;(async function main() {
  try {
    if (env === 'stage' || env === 'demo1') {
      console.log(env)
    } else {
      const result = await getLast(env)
      console.log(result)
    }
  } catch (error) {
    console.log(error.message, error)
    process.exit(1)
  }
})()
