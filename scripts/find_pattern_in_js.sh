#!/bin/sh

if [[ -z "$1" ]]
then
  echo ''
  echo 'Call it with a argument pattern string like that: ./find_pattern_in_js.sh "TODO"'
  echo ''
  exit 1
fi

GREEN='\033[0;32m'
NC='\033[0m'
i=0
for f in $(find . -name "*.js" -not -path "./node_modules/*");
do
  value=`grep "$1" $f | sed -e 's/^[[:space:]]*//'`
  if [[ -n "$value" ]]
  then
    let "i++"
    echo "$i) ${GREEN}$f${NC} \n\n $value \n\n"
  fi
done

exit 0