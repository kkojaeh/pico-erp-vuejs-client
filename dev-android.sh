export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
PATH=$PATH:$ANDROID_SDK_ROOT/tools;PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export ANDROID_EMULATOR_HOME=$ANDROID_SDK_ROOT/emulator
export ANDROID_AVD_HOME=$HOME/.android/avd
export FIREBASE_API_KEY='AIzaSyBaS7v9fhkK6Nn6MBqV02ej5T3ffdDKujc'
export FIREBASE_PERSISTENCE='local'
export API_BASE_URL='https://api-dev.acepk.biz/'
export API_CONTENT_TYPE='application/vnd.acepk.v1+json'
quasar dev -m cordova -T android