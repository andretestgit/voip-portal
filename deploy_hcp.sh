#!/bin/bash

# Intro
echo "Synchronise Github for $HCP_APP tag $GIT_TAG with HCP, overwriting any changes in HCP git."

# Remove all existing history and create a clean repository
rm -rf .git
git init

# Set the correct configuration to commit to HCP
git config --local user.email "$HCP_EMAIL"
git config --local user.name "Travis CI"

# Add all the current content as one commit
git add .
git commit -am "Release $GIT_TAG"

# Setup a remote repository to HCP and merging
git remote add hcp https://$HCP_USERNAME:$HCP_PASSWORD@git.$HCP_HOST/$HCP_ACCOUNT/$HCP_APP
git fetch hcp
git branch -u hcp/master
git pull -s recursive -X ours --commit --no-edit

# Removing previous local folders left over
mv ./local_$TRAVIS_BUILD_NUMBER ./temp_$TRAVIS_BUILD_NUMBER
rm -rf ./local_*
rm -rf webapp
mv ./temp_$TRAVIS_BUILD_NUMBER ./local_$TRAVIS_BUILD_NUMBER
git commit -am "Version $GIT_TAG"

# Tag a new version
git tag -a $GIT_TAG -m "Version $GIT_TAG"

# Pushing all changes to HCP git
echo "Push master and tag to https://git.$HCP_HOST/$HCP_ACCOUNT/$HCP_APP"
git push --quiet hcp master
git push --quiet hcp $GIT_TAG