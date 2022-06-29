#!groovy​

ddWithChatMessage {
  withCredentials(
    [usernamePassword(
      credentialsId: 'Expo',
      passwordVariable: 'EXP_PASSWORD',
      usernameVariable: 'EXP_USERNAME'
    ),
    string(credentialsId: 'CONFLUENCE_KEY', variable: 'CONFLUENCE_SECRET'),
    string(credentialsId: 'circlecitoken', variable: 'CIRCLECI_TOKEN')
    ]) {
        return doBuild()
    }
}

def doBuild() {
  node("em-expjs") {
    def externalMethod

    stage('Checkout') {
      checkout scm
    }

    stage('Configure') {
      externalMethod = load("scripts/externalMethod.groovy")
    }

    stage('Install') {
      sh "yarn install"
    }

    timeout(7) {
      stage('Deploy') {
        switch (env.JOB_NAME) {
          // mobile_deploy_IT_to_QA
          case ~/^.*IT.*QA$/:
            env.EXP_ENV = 'qa'
            sh "yarn expo:login"
            sh "yarn expo:deploy:it_to_qa"
            sh "yarn copyEnv"
          break
          // mobile_deploy_QA_to_DEMO1
          case ~/^.*QA.*DEMO1$/:
            env.EXP_ENV = 'demo1'
            sh "yarn expo:login"
            sh "yarn expo:deploy:qa_to_demo1"
            sh "yarn copyEnv"
          break
          // mobile_deploy_QA_to_DEMO2
          case ~/^.*QA.*DEMO2$/:
            env.EXP_ENV = 'demo2'
            sh "yarn expo:login"
            sh "yarn expo:deploy:qa_to_demo2"
            sh "yarn copyEnv"
          break
          default:
            error "[ERROR] No case for : ${env.JOB_NAME}"
          break
        }
      }
    }

    stage('Notify') {
      externalMethod.expoLogout()
      return externalMethod.notifyTeam(
          'New mobile app version deployed',
        env.EXP_ENV,
        env.EXP_USERNAME,
        env.BUILD_NUMBER
      )
    }
  }
}

