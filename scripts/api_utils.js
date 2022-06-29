#!/usr/bin/env node
/* eslint import/prefer-default-export: 0 */
const axios = require('axios')
const curry = require('ramda/src/curry')
const pipe = require('ramda/src/pipe')
const pathOr = require('ramda/src/pathOr')
const prop = require('ramda/src/prop')
const querystring = require('querystring')

// then :: f -> Thenable -> Thenable
const then = curry((f, thenable) => thenable.then(f))

// catchP :: f -> Promise -> Promise
const catchP = curry((f, promise) => promise.catch(f))

const getTokenAsync = curry((env, password, email) =>
  pipe(
    () =>
      axios({
        method: 'post',
        url: `https://auth-${env}.dev.docdok.ch/auth/realms/docdok/protocol/openid-connect/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
          client_id: 'browser',
          username: email,
          password,
          grant_type: 'password',
        }),
      }),
    then(pathOr('no thoken', ['data', 'access_token'])),
    catchP(e => {
      throw new Error(e)
    }),
  )(),
)

const getQATokenByEmailAsync = getTokenAsync('qa', '12345678')

const resetTermsByEmailAsync = pipe(
  getQATokenByEmailAsync,
  then(token =>
    axios({
      method: 'put',
      url:
        'https://qa.dev.docdok.ch/rest/user/api/users/me/acceptedTermsVersion',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      data: '2018-04-03',
    }),
  ),
  then(prop('status')),
  catchP(e => {
    throw new Error(e)
  }),
)

module.exports = {
  getTokenAsync,
  getQATokenByEmailAsync,
  resetTermsByEmailAsync,
  then,
  catchP,
}
