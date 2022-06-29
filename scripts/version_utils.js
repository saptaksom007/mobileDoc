const axios = require('axios')

const { resolveHome, readJSONfile } = require('./file_utils')

const { HOME } = process.env

const PROJECT_DATA = {
  queryType: 'history',
  slug: 'docdok',
  version: '2',
  count: '100'
}

async function getLastVersionAsync(data) {
  const home = HOME === '/tmp' ? '/home/jenkins' : resolveHome('~')
  const credentialsPath = `${home}/.expo/state.json`
  const { auth } = readJSONfile(credentialsPath)
  const result = await axios({
    method: 'POST',
    url: 'https://exp.host/--/api/publishInfo/[]',
    headers: {
      'Expo-Session': auth.sessionSecret,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    data
  })
  return result.data
}

module.exports = {
  getLastVersionAsync,
  PROJECT_DATA
}
