#!groovy​

ddWithChatMessage {
  withCredentials(
    [usernamePassword(
      credentialsId: 'Expo',
      passwordVariable: 'EXP_PASSWORD',
      usernameVariable: 'EXP_USERNAME'
    ),
    string(credentialsId: 'CONFLUENCE_KEY', variable: 'CONFLUENCE_SECRET'),
    string(credentialsId: 'circlecitoken', variable: 'CIRCLECI_TOKEN'),
    // usernamePassword(
    //   credentialsId: 'nexus',
    //   usernameVariable: 'NEXUS_U',
    //   passwordVariable: 'NEXUS_P'
    // ),
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
      if (env.JOB_NAME == 'create-new-environment-mobile' && env.EXP_ENV) {
        env.BASE_API_DOMAIN = "${env.EXP_ENV}.dev.docdok.ch"
        env.AUTH_DOMAIN = "auth-${env.EXP_ENV}.dev.docdok.ch"
      } else {
        if(env.JOB_NAME == 'create-new-environment-mobile') {
          String newEnv
          timeout(time: 5, unit: 'MINUTES') {
            newEnv = input message: 'Name of the OpenShift project', ok: 'Create', parameters: [string(defaultValue: 'demo', name: 'Name')]
            env.EXP_ENV = newEnv
          }
        } else {
          echo("Branch name => ${env.BRANCH_NAME}")
          if (env.JOB_NAME == 'mobile_deploy_IT_to_QA') {
            env.EXP_ENV = 'qa'
          } else {
            env.EXP_ENV = externalMethod.getEnvFromBranch(env.BRANCH_NAME, env.EXP_ENV)
          }
        }
      }

      sh "yarn copyEnv"
    }

    stage('Install') {
      sh "yarn install"
    }

    stage('Check') {
      sh "yarn lint"
      sh "yarn tsc"
      // sh "yarn check-vulnerabilities"
      sh "yarn prettier:list"
      // if (env.BRANCH_NAME == 'develop') {
        // TODO: sh "yarn check-deps"
      // }
    }

    stage('Test') {
      sh "yarn test --coverage --ci --testResultsProcessor='./node_modules/jest-junit-reporter' --maxWorkers 8"
      step([$class: 'JUnitResultArchiver', testResults: 'test-report.xml'])
    }



    timeout(7) {
      stage('Deploy') {
        externalMethod.deploy(env.EXP_ENV, env.BUILD_URL, env.JOB_NAME, env.BUILD_NUMBER)
      }
    }

    stage('e2e') {
      if(env.EXP_ENV == 'qa' && env.BRANCH_NAME == 'develop') {
        String endpoint = 'https://circleci.com/api/v1.1/project/gh/e-medicus/mobile-docdok/tree/develop?circle-token=$CIRCLECI_TOKEN'
        status_code = sh(
          script: "curl --write-out '%{http_code}\n' --silent -o /dev/null -d 'build_parameters[CIRCLE_JOB]=build-and-test' $endpoint",
          returnStdout: true
        )
        if(!status_code.contains("201")) {
          error('E2E build not launched: ' + status_code)
        }
      } else {
        echo "No E2e for this environment: ${env.EXP_ENV}"
      }
    }

    stage('Notify') {
      externalMethod.updateEnvPage(env.CONFLUENCE_SECRET, env.EXP_ENV)
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

