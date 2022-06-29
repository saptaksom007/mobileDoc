#!/bin/bash
set -e   # Exit if any command fail

login=''
password=''
echo '## Login to Expo with account'
login=${EXP_USERNAME}
password=${EXP_PASSWORD}
expo login --username ${login} --password ${password}
echo ''
