#!/usr/bin/env node

/* eslint no-console: 0 */

const { resolveHome, zipDirectoryAsync } = require('./file_utils')
const { exec } = require('child-process-async')
const fs = require('fs')

// eslint-disable-next-line
const [_, __, version] = process.argv
const { NEXUS_U, NEXUS_P } = process.env
const pathToDir = `${resolveHome(
  '~',
)}/.expo/ios-simulator-app-cache/Exponent-${version}.app`
const nexusUrl = 'https://nexus3.dev.docdok.ch/repository/docdok-binaries/'

const uploadToNexusAsync = zipPath =>
  exec(`curl -u '${NEXUS_U}:${NEXUS_P}' --upload-file ${zipPath} ${nexusUrl}`)

// main
;(async function main() {
  try {
    if (version) {
      const zipName = `Exponent-${version}.app`
      const zipPath = await zipDirectoryAsync(pathToDir, zipName)
      console.log(`Path to dir: ${pathToDir}`)
      console.log(`Zip Name: ${zipName}`)
      console.log(`Zip Path: ${zipPath}`)
      await uploadToNexusAsync(zipPath)
      fs.unlinkSync(zipPath)
      console.log('Done')
    } else {
      console.log('[ERROR] Provide version number as argument (ie. 2.0.0)')
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
