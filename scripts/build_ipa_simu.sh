#!/bin/bash

set -e   # Exit if any command fail

yarn expo:login

echo ''
echo 'Build iOS app simu'

channel=$(./scripts/get_last_version.js $EXP_ENV)

expo build:ios --no-publish --non-interactive --type simulator --no-wait --release-channel ${channel}

exptool wait:build --timeout 1800

echo ''

exit 0