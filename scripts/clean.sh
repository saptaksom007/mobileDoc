#!/bin/bash

set -e   # Exit if any command failes
watchman watch-del-all
rm -f yarn.lock
rm -rf node_modules
rm -rf $TMPDIR/react-*
yarn cache clean