#!/bin/bash

day_regex="(0[1-9]|1[0-9]|2[0-5])$"
day=$1

if [ -z "${day}" ]; then
    echo "You should inform a day as the first parameter!"
    exit 2
fi

if [[ ! "${day}" =~ ${day_regex} ]]; then
    echo "Day in invalid range! It should have a two-digit-value between 01 and 25!"
    exit 1
fi

npx ts-node ./day-${day}/index.ts