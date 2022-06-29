#!/bin/bash

set -e   # Exit if any command failed

echo ''
echo '# Publish to production'

. "${BASH_SOURCE%/*}/deploy_base.sh"

deploy_base stage production