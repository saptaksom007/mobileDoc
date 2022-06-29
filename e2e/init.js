/* eslint-disable */
require('babel-polyfill')
const detox = require('detox')
const config = require('../package.json').detox
const adapter = require('detox/runners/jest/adapter')
const specReporter = require('detox/runners/jest/specReporter')

jest.setTimeout(120000)
jasmine.getEnv().addReporter(adapter)
jasmine.getEnv().addReporter(specReporter)

beforeAll(async () => {
  global.__E2E__ = true
  await detox.init(config)
})

beforeEach(async function() {
  await adapter.beforeEach()
})

afterAll(async () => {
  await adapter.afterAll()
  await detox.cleanup()
})
