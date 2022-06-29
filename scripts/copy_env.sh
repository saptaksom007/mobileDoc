#!/bin/bash

# fail fast
set -e

echo '- copy_env started'

publishedAt=`date +%F-%H:%M-%Z`
version=`cat package.json | jq -r .version`
project=`cat src/config/api.json | jq -r .${EXP_ENV:=qa}.apm.project`
publicDSN=`cat src/config/api.json | jq -r .${EXP_ENV:=qa}.apm.publicDSN`
buildNumber=`cat app.json | jq -r .expo.ios.buildNumber`
versionCode=`cat app.json | jq -r .expo.android.versionCode`
sdkVersion=`cat app.json | jq -r .expo.sdkVersion`

echo "- env = ${EXP_ENV:=qa}"
echo "- version = ${version}"
echo "- jenkins build number = ${BUILD_NUMBER:=qa}"
echo "- publishedAt = ${publishedAt}"
echo "- sentry project = ${project}"
echo "- ios buildNumber = ${buildNumber}"
echo "- android versionCode = ${versionCode}"

echo ''
echo '- configure env.ts'
if [ -f ./env.ts ]; then
    cp ./env.ts ./env.ts.old # save a copy
fi
cp ./scripts/environments/env.sample.ts ./env.ts

sed -i.bak s/\{\{publishedAt\}\}/`echo ${publishedAt}`/g env.ts
sed -i.bak s/\{\{buildNumber\}\}/`echo ${BUILD_NUMBER:=1}`/g env.ts
sed -i.bak s/\{\{realm\}\}/`echo ${REALM:='docdok'}`/g env.ts
echo 'env.ts content =>'
echo ''
cat env.ts

echo ''
if [ "$NODE_ENV" != "development" ]
then
    echo '- no change in app.json on dev'
else
    echo '- configure app.json'
    cp ./app.json ./app.json.old
    cp ./scripts/environments/app.sample.json ./app.json
    sed -i.bak s/BUILD_NUMBER/`echo ${buildNumber:='1'}`/g app.json
    sed -i.bak s/VERSION_CODE/`echo ${versionCode:=1}`/g app.json
    sed -i.bak s/SDK_VERSION/`echo ${sdkVersion:='37.0.0'}`/g app.json
    sed -i.bak s/sentryProject/`echo ${project:='mobile-it'}`/g app.json
    sed -i.bak s/VERSION/`echo ${version}`/g app.json
    sed -i.bak "s,sentryPublicDSN,${publicDSN},g" app.json
    if [ "$EXP_ENV" == "demo1" ]
    then
        echo '- configure for demo1'
        jq '.expo.name = "docdemo1"' app.json > app.tmp.json
        mv app.json app.old2.json
        cp app.tmp.json app.json
    fi
fi
echo 'app.json content =>'
echo ''
cat app.json

echo '- copy_env finished'
exit 0