#!/bin/bash

# Moving the local folder to the final location
mv ./local ./local_$TRAVIS_BUILD_NUMBER
echo $TRAVIS_BUILD_NUMBER

# Replacing references in the index.html file
perl -pi -e "s/local/$TRAVIS_BUILD_NUMBER/g" ./build.json
perl -pi -e "s/WEBIDE/$TRAVIS_BUILD_NUMBER/g" ./build.json