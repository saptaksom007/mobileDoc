#!/usr/local/bin/groovy

import groovy.json.JsonOutput


def getConfluencePageConnection(pageId) {
  return new URL("https://docdok.atlassian.net/wiki/rest/api/content/$pageId").openConnection();
}

def getConfluencePage(credentials, pageId) {
  def get = getConfluencePageConnection(pageId)
  get.setRequestMethod("GET")
  get.setDoOutput(true)
  get.setRequestProperty("Authorization", "Basic ${credentials.bytes.encodeBase64().toString()}")
  def getRC = get.getResponseCode()
  if(getRC.equals(200)) {
    String jsonContent = get.getInputStream().getText()
    return new groovy.json.JsonSlurper().parseText(jsonContent)
  } else {
    echo("[ERROR] ${getRC}")
    return new groovy.json.JsonSlurper().parseText("{}")
  }
}

def removeReturn(String str) {
  return str.replaceAll("[\n\r]", "")
}

def updateConfluencePage(credentials, pageId, title, version, content) {
  def jsonToPut = groovy.json.JsonOutput.toJson([
    id: pageId,
    type: 'page',
    title: title,
    space: [ key: "DOCDOK" ],
    body: [
      storage: [
        value: content,
        representation: 'storage'
      ]
    ],
    version: [number: version]
  ])
  def put = getConfluencePageConnection(pageId)
  put.setRequestMethod("PUT")
  put.setDoOutput(true)
  put.setRequestProperty("Content-Type", "application/json")
  put.setRequestProperty("Authorization", "Basic ${credentials.bytes.encodeBase64().toString()}")
  String payload = removeReturn(jsonToPut)
  put.getOutputStream().write(payload.getBytes("UTF-8"))
  def putRC = put.getResponseCode()
  echo("Response code on PUT doc $putRC ")
}

def getAppLinkByChannel(channel) {
  String expoLogin = 'dev-team-e-medicus'
  return "https://exp.host/@${expoLogin}/docdok?release-channel=${channel}"
}

def liInnerEnv(key, value) {
  String qrcode = java.net.URLEncoder.encode(getAppLinkByChannel(value), "UTF-8")
  String testflight = 'iOS: no'
  String apkUrl = 'Android: no'
  if (key == 'qa') {
    testflight = "iOS: <a href=\"https://testflight.apple.com/join/8QmKf4q9\" target=\"_blank\">TestFlight</a>"
    apkUrl = "Android: <a href=\"https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40dev-team-e-medicus/docdok-b8fff61e17fc4c4bb7a469b33c6a438b-signed.apk\" target=\"_blank\">Download APK</a>"
  }
  return """
    <li>
      <strong>$key:</strong>
      <br/><br/><br/>
      <ac:image>
        <ri:url ri:value=\"http://api.qrserver.com/v1/create-qr-code/?data=${qrcode}\" />
      </ac:image>
      <br/><br/><br/>
      <a href=\"${getAppLinkByChannel(value)}\" target="_blank">Open into Expo app</a>
      <br/>
      $testflight
      <br/>
      $apkUrl
      <br/><br/><br/>
    </li>
  """
}

def jsonEnvToHtml(jsonString) {
  def json = new groovy.json.JsonSlurper().parseText(jsonString)
  def keys = json.keySet()
  def li = keys.collect { k -> liInnerEnv(k, json.get(k)) }
  String expoLinkText = "Open into Expo app"
  String content = """
    <ul>
      ${li.join("")}
      <li>
        <strong>stage:</strong>
        <br/><br/><br/>
        <ac:image>
          <ri:url ri:value=\"http://api.qrserver.com/v1/create-qr-code/?data=${java.net.URLEncoder.encode(getAppLinkByChannel('stage'), 'UTF-8')}\" />
        </ac:image>
        <br/><br/><br/>
        <a href=\"${getAppLinkByChannel('stage')}\" target="_blank">$expoLinkText</a>
        <br/>
        iOS: <a href=\"https://testflight.apple.com/join/SkPkZ7ee\" target="_blank">TestFlight</a>
        <br/>
        Android: <a href=\"https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40dev-team-e-medicus/docdok-0acd8b6d7eaf439db57b519561b00e64-signed.apk\" target=\"_blank\">Download APK</a>
        <br/><br/><br/>
      </li>
      <li>
        <strong>demo1:</strong>
        <a href=\"${getAppLinkByChannel('demo1')}\" target="_blank">demo1</a>
        <br/><br/><br/>
        <ac:image>
          <ri:url ri:value=\"http://api.qrserver.com/v1/create-qr-code/?data=${java.net.URLEncoder.encode(getAppLinkByChannel('demo1'), 'UTF-8')}\" />
        </ac:image>
        <br/><br/><br/>
        <a href=\"${getAppLinkByChannel('demo1')}\" target="_blank">$expoLinkText</a>
        <br/>
        iOS: <a href=\"https://testflight.apple.com/join/GmHyi2IA\" target="_blank">TestFlight</a>
        <br/>
        Android: <a href=\"https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40dev-team-e-medicus/docdok-10b80120b4454423ab113c56849ce9b7-signed.apk\" target=\"_blank\">Download APK</a>
        <br/><br/><br/>
      </li>
      <li>
        <strong>demo2:</strong>

        <br/><br/><br/>
        <ac:image>
          <ri:url ri:value=\"http://api.qrserver.com/v1/create-qr-code/?data=${java.net.URLEncoder.encode(getAppLinkByChannel('demo2'), 'UTF-8')}\" />
        </ac:image>
        <br/><br/><br/>
        <a href=\"${getAppLinkByChannel('demo2')}\" target="_blank">$expoLinkText</a>
        <br/>
        iOS: <a href=\"https://testflight.apple.com/join/lZr7TVCm\" target="_blank">TestFlight</a>
        <br/>
        Android: <a href=\"https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40qa-team-e-medicus/docdok-58541ab0495a49f68444188125aba1f9-signed.apk\" target=\"_blank\">Download APK</a>
        <br/><br/><br/>
      </li>
    </ul>
  """
  return removeReturn(content)
}

def updateEnvPage(credentials, environment) {
  if(environment != 'production' && environment != 'stage' && environment != 'demo1') {
    String pageId = "221151233"
    String envs = shell("./scripts/get_last_version.js")
    String pageContent = jsonEnvToHtml(envs)
    echo "credentials = $credentials"

    def currentPage = getConfluencePage(credentials, pageId)
    def version = currentPage.get('version')
    if (version) {
      def versionNumber = version.get('number')
      def title = currentPage.get('title')
      updateConfluencePage(credentials, pageId, title, versionNumber + 1, pageContent)
    } else {
      echo "Can't update confluence page"
    }

  } else {
    echo "Do not update 'Mobile Environment' wiki page into a production, stage and demo1 build."
  }
}

def getVersion(String environment, String buildNumber, String channel) {
  String version = shell("cat package.json | jq -r .version")
  return """
- version: $version
- build: $buildNumber
- environment: $environment
- channel: $channel
"""
}

def expoLogin() {
  sh "yarn expo:login"
}

def expoLogout() {
  sh "yarn expo:logout"
}

def deploy(String environment, String buildUrl, String jobName, String buildNumber) {
  expoLogin()
  if(environment == 'production') {
    // jenkinsNeedsYourInput(buildUrl, jobName, buildNumber)
    publish = input message: 'Publish in production ? (yes or no)', ok: 'Publish', parameters: [string(defaultValue: 'no', name: 'Response')]
    if(publish == 'yes'){
      sh "yarn expo:deploy"
    } else {
      // do nothing
      echo "Not published in production"
    }
  } else {
    sh "yarn expo:deploy"
  }
}

def getEnvFromBranch(String branchName, String env) {
  if(branchName == null) {
    echo("Build failed because of branch name is undefined")
    return env
  }
  if(env == 'demo1') {
    return env
  }
  if(branchName == 'master') {
    return 'production'
  } else if(branchName.startsWith('feature/') || branchName.startsWith('hotfix/')) {
    return 'qa'
  } else if(branchName.startsWith('release/')) {
    return 'stage'
  } else if(branchName == 'develop') {
    if(env == 'qa') {
      return 'qa'
    }
    return 'it'
  }
}

def slackShowQrCode(String qrcode) {
  def attachments = [[
      color: "#36a640",
      // title: 'Scan the qrcode',
      title_link: qrcode,
      image_url: qrcode
    ]]
  slackSend(attachments: JsonOutput.toJson(attachments))
}

def shell(String cmd) {
  sh script: cmd, returnStdout: true
}

@NonCPS
def getQRCode(url = "https://exp.host/@dev-team-e-medicus/docdok") {
  return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=$url"
}

def notifyTeam(
  String title,
  String environment,
  String username,
  String buildNumber,
  boolean showQrCode = true) {
  String channel = shell("./scripts/get_channel.js")
  String link_to_test = getAppLinkByChannel(channel)
  String version = getVersion(environment, buildNumber, channel)
  String qrcode = getQRCode(link_to_test)
  String baseApiDomain = shell("cat src/config/api.json | jq -r .${environment}.api")
  String authDomain = shell("cat src/config/api.json | jq -r .${environment}.auth")
  String expoSdkVersion = shell("cat app.json | jq -r .expo.sdkVersion")
  String message = """
:shipit: :calling: *$title*
:control_knobs: *All Mobile Env:* https://docdok.atlassian.net/wiki/spaces/DOCDOK/pages/221151233/Mobile+Environments
:microscope:
$link_to_test
:1234:
$version
:coffee: Api: $baseApiDomain
:key: Auth: $authDomain
:gear: Expo SDK $expoSdkVersion
"""

  if (showQrCode) {
    slackShowQrCode(qrcode)
  }

  return message
}

return this