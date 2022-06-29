#!/bin/bash

set -e   # Exit if any command fail

yarn expo:login

echo 'Build Android apk'

if [ "$EXP_ENV" == "production" ]
then
    expo build:android --no-publish --non-interactive --no-wait --release-channel $EXP_ENV
else
    channel=$(./scripts/get_last_version.js $EXP_ENV)
    expo build:android --no-publish --non-interactive --no-wait --release-channel ${channel}
fi

exptool wait:build --timeout 1800

exit 0