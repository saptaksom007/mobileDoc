[![CircleCI](https://circleci.com/gh/e-medicus/mobile-docdok.svg?style=svg&circle-token=e35de79a96e1a9b16c6ba396a6a1b60516c5f62a)](https://circleci.com/gh/e-medicus/mobile-docdok)

# docdok.health mobile apps for iOS 📱 & Android 🤖

## Summary

1.  [Stack](#stack)
1.  [Prerequisites](#prerequisites)
1.  [Development Steps](#development-steps)
1.  [Development Cycle & Branches](#development-cycle-branches)
1.  [Builds Environments](#builds-environments)
1.  [Building & publising for production](#building-publising-for-production)
    1.  [Source code version for production](#source-code-version-for-production)
    1.  [Android builds](#android-builds)
    1.  [iOS builds](#ios-builds)
1.  [Jenkins configuration](#jenkins-configuration)
    1.  [Jenkins Builds](#jenkins-builds)
    1.  [Dockerfile install setup](#dockerfile-install-setup)
    1.  [Build environment variables](#build-environment-variables)
1.  [Plop scafolding](#plop-scafolding)
1.  [End To End](#end-to-end)
1.  [Git flow](#git-flow)
1.  [FAQ](#faq)

## Stack

- [expo](https://expo.io/)
- [redux](http://redux.js.org/)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [react-navigation](https://github.com/react-navigation/react-navigation)
- [axios](https://github.com/mzabriskie/axios)
- [jest](https://facebook.github.io/jest/)
- [yarn](https://yarnpkg.com/)
- eslint (with airbnb rules, see it on package.json)
- [plop](https://github.com/amwmedia/plop)
- [prettier](https://github.com/prettier/prettier)
- detox for e2e test

## Prerequisites

### Mac

1.  **node** `brew install node` (version >= 8.2.0 && < 9.2.1)
1.  **nvm** follow steps here: https://github.com/creationix/nvm
1.  **yarn** `curl -o- -L https://yarnpkg.com/install.sh | bash --version 1.5.1` (version >= 1.5.1)
1.  **watchman** `brew install watchman`
1.  **exp** `yarn global add exp` (version >= 49.2.2)
1.  **plop** `yarn add global plop`
1.  **coreUtils** `brew install coreutil`
1.  **jq** `brew install jq`
1.  **[genymotion](https://www.genymotion.com/)** as Android simulator
1.  Setup path: `export PATH="$PATH:$(yarn global bin)` and `export PATH="$PATH:$HOME/.config/yarn/global/node_modules/.bin"`
1.  Add `REACT_EDITOR=code` into your RC file (.bashrc or other, .zshrc, ...) and restart terminal (ie `code` is just an example, you specify code|atom|sublime|...)
1.  Add `NODE_ENV=development`

## Development Steps

1.  `git clone https://github.com/e-medicus/mobile-docdok`
1.  `cd mobile-docdok`
1.  `yarn install`
1.  `yarn run copyEnv`
1.  `yarn verify`
1.  For ios simulator: `yarn start-ios` or `yarn start-android`

## Development Cycle & Branches

(see git flow section)

1.  Develop on `develop` branch, this is the `IT` environment
1.  If it's OK on `IT`, build [`mobile_deploy_IT_to_QA`](https://jenkins.ocroute.e-medicus.tech/job/mobile_deploy_IT_to_QA/)
1.  If QA app is OK you can create a release branch `release/*`
1.  If stage app is OK you can push `release/*` to `master`

### Using git flow

- follow steps here: https://danielkummer.github.io/git-flow-cheatsheet/

## Building & publising for production

#### Source code version for production

Push your tested code to `master` branch fro, `release/*` branch.

#### Android builds

1.  Change production build to setup API urls (https://jenkins.ocroute.e-medicus.tech/view/mobile-docdok/job/mobile-docdok-android-production/configure)
1.  Launch production builds (https://jenkins.ocroute.e-medicus.tech/view/mobile-docdok/job/mobile-docdok-android-production/build)
1.  Follow build on Jenkins or on Hipchat jenkins channel
1.  Publish production APK to **Google Play Store** (https://play.google.com/apps/publish/?hl=fr&dev_acc=06326185159297251908#AppDashboardPlace:p=ch.emedicus.docdok.health)

#### iOS builds

1.  Change production build to setup API urls (https://jenkins.ocroute.e-medicus.tech/view/mobile-docdok/job/mobile-docdok-ios-production/configure)
1.  Launch production builds (https://jenkins.ocroute.e-medicus.tech/view/mobile-docdok/job/mobile-docdok-ios-production/build)
1.  Follow build on Jenkins or on Hipchat jenkins channel
1.  Publish production IPA to **Apple Store** (https://itunesconnect.apple.com/ and https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/1233226540)
1.  IDFA https://segment.com/docs/sources/mobile/ios/quickstart/#step-5-submitting-to-the-app-store
    [![idfa](https://raw.githubusercontent.com/e-medicus/mobile-docdok/master/docs/idfa.png?token=AA4VnGoEk42rVQkitTbw1IWfjBg_743Hks5bR2EcwA%3D%3D)](https://raw.githubusercontent.com/e-medicus/mobile-docdok/master/docs/idfa.png?token=AA4VnGoEk42rVQkitTbw1IWfjBg_743Hks5bR2EcwA%3D%3D)

#### Expo

- You can follow native build here: https://expo.io/@dev-team-e-medicus/docdok/builds
- Sometimes build failed and block next build, jou can cancel it from this previous link (ie. expo.io/.../builds)

## Jenkins configuration

### Jenkins Builds

- https://jenkins.ocroute.e-medicus.tech/view/mobile-docdok/

### Dockerfile install setup

- https://github.com/e-medicus/jenkins-slave-expo

### Build environment variables

- `EXP_ENV` = it | qa | stage | production | \* (ie. demo env)
- `BASE_API_DOMAIN` = it.ocroute.e-medicus.tech | qa.ocroute.e-medicus.tech | ???
- `AUTH_DOMAIN` = auth-it.ocroute.e-medicus.tech | auth-qa.ocroute.e-medicus.tech | ???
- `EXP_USERNAME` & `EXP_PASSWORD` are extracted from Jenkins credentials

## Plop scafolding

### screen scafolding

#### // PREPEND ... comment in code should not be removed

- // PREPEND SCREEN IMPORT HERE
- // PREPEND SCREEN HERE
- // PREPEND SAGAS IMPORT HERE
- // PREPEND SAGAS HERE
- // PREPEND REDUCER IMPORT HERE
- // PREPEND REDUCER HERE

### component scafolding

Create a simple component.

### hoc scafolding

Create hight order component.

## End To End

- Add config into your env.js file

```
e2e: {
  config: {
   login: 'max-api@muster.mm',
   password: '12345678',
  },
},
```

- Run this command from the project's root in a terminal: `yarn e2e`

### Troubleshooting

- Create `e2e/screenshots/` folder
- You must use it with a mac.
- You must start expo: `expo r -c`.
- Verify the version of Expo do you have in package.json (into script e2e and into e2e config)
- Verify which version do you have here \$HOME/.expo/ios-simulator-app-cache/

## Git flow

<pre>
+ master         + develop               + branch "release/*" + branch "feature/*" +
| env production | env it, QA, demo      | "hotfixe/*"        | env QA             |
|                |                       | env stage          |                    |
|                |                       |                    |                    |
|                |         Start         |                    |                    |
|                |           o-----------------------------------------+           |
|                |                       |                    |        |           |
|                |   +----------------+  |                    | +------v------+    |
|                |   |  merge, chore  +<------------------------+ new feature |    |
|                |   |      tests     |  |                    | +-------------+    |
|                |   +-------+--------+  |                    |                    |
|                |           |           |                    |                    |
|                |           |           |                    |                    |
|                |     +----------+      |    +----------+    |                    |
|                |     + QA tests +---------> | Formals  |    |                    |
|                |     +----------+      |    +----------+    |                    |
|                |                       |            |       |                    |
| +-----------+  |                       |            |       |                    |
| |  Release  <--------------+------------------------+       |                    |
| |    Tag    |  |           |           |                    |                    |
| +-----|-----+  |           V           |                    |                    |
+       o End    +         merge         +                    +                    +
</pre>

## FAQ

### Troubleshooting on local

1.  Stop your current expo packager.
1.  `yarn cleaning && yarn install && yarn verify`
1.  And restart `yarn start-ios` or `yarn start-android`

### More troubleshooting on local

- Make sure you are login to exponent `expo w`. If not, just login with command `expo login`
- If you have an error with `DTrace` in log, you should remove and reinstall `exp` (ie. `yarn global remove expo-cli && yarn global add expo-cli`)
- Be sure you have the good yarn version describe in [Prerequisites](#)

### Error: in View(at AppContainer.js:92) in AppContainer(at renderApplication.hs:34)

- Disable Hot-Reload in Expo (shake your phone to display the menu)

### Error: batch bridge

- If you're blocked on red screen with a message on iOS simulator, just remove app from simulator (long touch on expo app icon)

### [iOS] How to resign an IPA file with adhoc provisioning profil (ie. for testing with appium) ?

1.  Prerequisites: be sure your build with expo using a certificate you own, a certificates you create yourself from here: https://developer.apple.com/account/ios/certificate/
1.  Install https://github.com/saucelabs/isign and follow steps

### Jenkins Build Failing

When build is failing with the following error just **run it again**:

```
[exp] Validating distribution certificate...
[exp] Error validating credentials. You may need to clear them (with `-c`) and try again.
[exp] Unable to validate credentials. Request ID ac7dee00-8253-11e7-9a3b-5d94c3b00b77, message: Internal error occurred. Please try again in a few minutes or contact support.
```

```
[exp] Dependency graph loaded.
Cancelling nested steps due to timeout
sh: line 1:   268 Terminated              JENKINS_SERVER_COOKIE=$jsc '/tmp/workspace/mobile-docdok-ios-production@tmp/durable-ab8bd2e3/script.sh' > '/tmp/workspace/mobile-docdok-ios-production@tmp/durable-ab8bd2e3/jenkins-log.txt' 2>&1
```

### Android app not started correctly (ie. <app> isn't responding. Do you want to close it?)

- If app boot just show the splash and "<app> isn't responding. Do you want to close it?"
- Explanation: it's not loading the bundle from the internet unless you published again though
- How to fix it?
  - relaunch a expo publish from jenkins to push the js bundle

# navigation & role

## ROLE_PATIENT:

- route: /
  actions: []
- route: /messages
  actions: []
- route: /messages/conversation/:conversationId
  actions: [sendMessage, sendAttachment]
- route: /profile
  actions: [changeAvatar, displayTerms]
- route: /patients
  actions: []
- route: /patients/:patientId
  actions: [viewSurveyResponses, launchSurvey, sendMessage, sendAttachment, changeAvatar]
- route: /surveys/:surveyId/participants
  actions: [launchSurvey, viewSurveyResponses]
- route: /surveys/:surveyId/participants/completed
  actions: [viewSurveyResponses]
