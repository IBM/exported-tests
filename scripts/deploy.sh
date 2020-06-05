#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

# exit with an error if the build fails
if [[ ${TRAVIS_TEST_RESULT=0} == 1 ]]; then
  exit 1;
fi

# run the build
npm run build
#deploy with semantic-release
npx semantic-release
