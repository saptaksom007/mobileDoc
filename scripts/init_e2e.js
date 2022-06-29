#!/usr/bin/env node

const { exec } = require('child-process-async')
const fs = require('fs')

const dropboxUrl = 'https://www.dropbox.com/s/914f88xoiy5nxew/'

const downloadAsync = zipName => {
  const command = `curl -L -o ${zipName} ${dropboxUrl}${zipName}\?dl\=0`
  console.log(command)
  return exec(command)
}

const unzipAsync = (zipName, appPath) => {
  const command = `tar -xf ${zipName} -C ${appPath}`
  console.log(command)
  return exec(command)
}

const lsAsync = file => {
  const command = `ls -ali ${file}`
  console.log(command)
  return exec(command)
}

// main
;(async function main() {
  try {
    const appName = `Exponent`
    const zipName = `${appName}.tar.gz`
    const appPath = `e2e/`

    console.log(`App Name: ${appName}`)
    console.log(`Zip Name: ${zipName}`)
    console.log(`App Path: ${appPath}`)

    if (fs.existsSync(`${appPath}/Exponent-2.11.1.app`)) {
      console.log('App directory already exist!')
    } else {
      await downloadAsync(zipName)
      await lsAsync(zipName)
      await unzipAsync(zipName, appPath)
      fs.unlinkSync(zipName)
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
