var merge = require('webpack-merge')
process.env.DEPLOY_PROFILE = process.env.DEPLOY_PROFILE || '"dev"'
module.exports = merge(process.env, {
  NODE_ENV: '"production"'
})
