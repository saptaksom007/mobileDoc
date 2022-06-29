/* eslint no-console: 0 */

const path = require('path')
const os = require('os')
const fs = require('fs')
const zipFolder = require('zip-a-folder')

const resolveHome = (filepath = '~/') =>
  filepath[0] === '~' ? path.join(os.homedir(), filepath.slice(1)) : filepath

function readJSONfile(jsonPath) {
  const contents = fs.readFileSync(jsonPath, { encoding: 'utf-8' })
  return JSON.parse(contents)
}

const zipDirectoryAsync = async (pathToDir, archiveName) => {
  const zipName = `./${archiveName}.zip`
  await zipFolder.zip(pathToDir, zipName)
  return zipName
}

module.exports = {
  resolveHome,
  readJSONfile,
  zipDirectoryAsync
}
