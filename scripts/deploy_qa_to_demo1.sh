#!/bin/bash

set -e   # Exit if any command failed

echo ''
echo '# Publish to demo1'

. "${BASH_SOURCE%/*}/deploy_base.sh"

deploy_base qa demo1