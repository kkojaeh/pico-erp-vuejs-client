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
Vue.config.productionTip = false


import 'quasar-extras/roboto-font'

import 'quasar-extras/material-icons'

import 'quasar-extras/fontawesome'




import 'quasar-app-styl'


import 'src/css/app.styl'


import App from 'src/App'

import router from 'src/router'

import store from 'src/store'


const app = {
  el: '#q-app',
  router,
store,
  ...App
}


const plugins = []

import pluginAxios from 'src/plugins/axios'
plugins.push(pluginAxios)

import pluginAlert from 'src/plugins/alert'
plugins.push(pluginAlert)

import pluginAuth from 'src/plugins/auth'
plugins.push(pluginAuth)

import pluginComponents from 'src/plugins/components'
plugins.push(pluginComponents)

import pluginValidate from 'src/plugins/validate'
plugins.push(pluginValidate)

import pluginNumber from 'src/plugins/number'
plugins.push(pluginNumber)

import pluginDate from 'src/plugins/date'
plugins.push(pluginDate)

import pluginCloseoverlay from 'src/plugins/close-overlay'
plugins.push(pluginCloseoverlay)

plugins.forEach(plugin => plugin({ app, router, store, Vue }))









new Vue(app)



