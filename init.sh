#!/usr/bin/env sh

npm install -g jscs
npm install -g quasar-cli
npm install -g cordova
npm install -g ios-deploy --unsafe-perm=true
gem install cocoapods
./pod setup

export ANDROID_HOME="$HOME/Library/Android/sdk"
PATH=$PATH:$ANDROID_HOME/tools;PATH=$PATH:$ANDROID_HOME/platform-tools
npm install
quasar wrap cordova
cd cordova
ln -s www ../dist
cordova plugin add cordova-plugin-crosswalk-webview
cordova plugin add phonegap-nfc
cordova platform add android
cordova platform add ios
cd ..
