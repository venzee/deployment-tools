#!/bin/bash
set -e

echo BUILD_TARGET: $BUILD_TARGET
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Preparing Config file"
${DIR}/preparefeatureconfigfile
feature_id=`${DIR}/extractfeatureid`

echo "Building Feature ${feature_id}, based on $BUILD_TARGET"
npm run build --force

echo "Copying dist to /build"
cp -r /home/$PROJECT_PATH/app/$PROJECT_TO_DEPLOY_PATH /$PROJECT_BASE_BUILD_PATH

echo "Copying deploy scripts to /build"

cp /home/$PROJECT_PATH/app/clearcdncache /$PROJECT_BASE_BUILD_PATH
cp /home/$PROJECT_PATH/app/extractfeatureid /$PROJECT_BASE_BUILD_PATH
cp /home/$PROJECT_PATH/app/deployfeature.sh /$PROJECT_BASE_BUILD_PATH

echo "Build done succesfully"
