#!/bin/bash

set -e

if [ ! -f ./env.ts.old ]; then
    echo "File not found: ./env.ts.old"
    exit 1
fi



echo ''
echo '####################'
echo '## Revert env.ts  ##'
echo '####################'
mv -f ./env.ts.old ./env.ts  # save a copy
echo ''


if [ ! -f ./app.json.old ]; then
    echo "File not found: ./app.json.old"
    exit 2
fi

echo ''
echo '#####################'
echo '## Revert app.json ##'
echo '#####################'
mv -f ./app.json.old ./app.json  # save a copy
echo ''

echo ''
echo '#########################'
echo '## Cleaning *.bak file ##'
echo '#########################'
rm -f env.ts.bak
rm -f app.json.bak

exit 0