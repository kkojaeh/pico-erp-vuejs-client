export ANDROID_HOME="$HOME/Library/Android/sdk"
PATH=$PATH:$ANDROID_HOME/tools;PATH=$PATH:$ANDROID_HOME/platform-tools
export FIREBASE_API_KEY='AIzaSyBaS7v9fhkK6Nn6MBqV02ej5T3ffdDKujc'
export FIREBASE_PERSISTENCE='session'
export API_BASE_URL='https://api-dev.acepk.biz/'
export API_CONTENT_TYPE='application/vnd.acepk.v1+json'
quasar build -m cordova -T android