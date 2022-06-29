#!/bin/bash

set -e   # Exit if any command failed

send_to_email="milan.valand@docdok.health"

echo ''
echo '# Publish to exponent'
if [ "$EXP_ENV" == "production" ]
then
  echo '# PRODUCTION #'
  ./scripts/deploy_to_production.sh
else
  channel=`./scripts/get_channel.js`
  expo publish --quiet --non-interactive --send-to $send_to_email --release-channel ${channel}
  echo ''

  exit 0
fi
