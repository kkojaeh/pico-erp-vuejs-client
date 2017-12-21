var merge = require('webpack-merge')
var env = {
  API_SERVER_URL : process.env.API_SERVER_URL,
  FIREBASE_PROJECT_ID : process.env.FIREBASE_PROJECT_ID
}
env.API_SERVER_URL = env.API_SERVER_URL || '"https://api-dev.acepk.biz/"'
env.FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID || '"pico-erp-dev"'
module.exports = merge(env, {
  NODE_ENV: '"production"'
})
