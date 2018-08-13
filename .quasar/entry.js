/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import './quasar'

import Vue from 'vue'
import 'quasar-extras/roboto-font'

import 'quasar-extras/material-icons'

import 'quasar-extras/fontawesome'

import 'quasar-app-styl'

import 'src/css/app.styl'

import App from 'src/App'

import router from 'src/router'

import store from 'src/store'
import pluginAxios from 'src/plugins/axios'
import pluginAlert from 'src/plugins/alert'
import pluginAuth from 'src/plugins/auth'
import pluginComponents from 'src/plugins/components'
import pluginValidate from 'src/plugins/validate'
import pluginNumber from 'src/plugins/number'
import pluginDate from 'src/plugins/date'
import pluginCloseoverlay from 'src/plugins/close-overlay'
import pluginClipboard from 'src/plugins/clipboard'
import pluginIntro from 'src/plugins/intro'
import pluginGoogleanalytics from 'src/plugins/google-analytics'
import pluginRaven from 'src/plugins/raven'
import pluginAggrid from 'src/plugins/ag-grid'
import pluginItem from 'src/plugins/item'
import pluginBom from 'src/plugins/bom'
import pluginAudit from 'src/plugins/audit'
import pluginProcess from 'src/plugins/process'
import pluginProject from 'src/plugins/project'
import pluginCompany from 'src/plugins/company'

Vue.config.productionTip = false

const app = {
  el: '#q-app',
  router,
store,
  ...App
}


const plugins = []

plugins.push(pluginAxios)

plugins.push(pluginAlert)

plugins.push(pluginAuth)

plugins.push(pluginComponents)

plugins.push(pluginValidate)

plugins.push(pluginNumber)

plugins.push(pluginDate)

plugins.push(pluginCloseoverlay)

plugins.push(pluginClipboard)

plugins.push(pluginIntro)

plugins.push(pluginGoogleanalytics)

plugins.push(pluginRaven)

plugins.push(pluginAggrid)

plugins.push(pluginItem)

plugins.push(pluginBom)

plugins.push(pluginAudit)

plugins.push(pluginProcess)

plugins.push(pluginProject)

plugins.push(pluginCompany)

plugins.forEach(plugin => plugin({ app, router, store, Vue }))









new Vue(app)



