#!/bin/bash

if [ $# -lt 1 ]
then
    echo "No environments specified." >&2
fi

while [ $# -gt 0 ]
do
    if [ ! -f "./config/$1.json" ]
    then
        cp './config/default.json' "./config/$1.json"
    fi
    shift
done
