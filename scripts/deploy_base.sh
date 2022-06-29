#!/bin/bash

deploy_base()
{
  FROM_CHANNEL=$1
  TO_CHANNEL=$2
  LOCAL_PATH=${BASH_SOURCE%/*}
  if [ $FROM_CHANNEL = 'it' ]
  then
    FROM_CHANNEL=$(${LOCAL_PATH}/get_last_version.js it)
  fi
  echo "From ${FROM_CHANNEL} To ${TO_CHANNEL}"
  ios_publicationid=$(${LOCAL_PATH}/get_last_publicationid.js ${FROM_CHANNEL} ios)
  android_publicationid=$(${LOCAL_PATH}/get_last_publicationid.js ${FROM_CHANNEL} android)
  echo "ios_publicationid = ${ios_publicationid}"
  echo "android_publicationid = ${android_publicationid}"
  expo publish:set --publish-id ${ios_publicationid} --release-channel ${TO_CHANNEL}
  expo publish:set --publish-id ${android_publicationid} --release-channel ${TO_CHANNEL}
}

export -f deploy_base