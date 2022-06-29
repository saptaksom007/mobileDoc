#!/usr/bin/env node
/* eslint no-console: 0 */

const { resetTermsByEmailAsync } = require('./api_utils')

;

(async () => {
  try {
    const result = await resetTermsByEmailAsync('max-api@muster.mm')
    console.log(result)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
