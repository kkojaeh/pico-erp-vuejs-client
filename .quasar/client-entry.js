/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/

import 'quasar-framework/dist/quasar.ie.polyfills.js'



import 'quasar-extras/roboto-font/roboto-font.css'

import 'quasar-extras/material-icons/material-icons.css'

import 'quasar-extras/fontawesome/fontawesome.css'




import 'quasar-app-styl'


import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'




import pAxios from 'src/plugins/axios'

import pAlert from 'src/plugins/alert'

import pAuth from 'src/plugins/auth'

import pComponents from 'src/plugins/components'

import pValidate from 'src/plugins/validate'

import pNumber from 'src/plugins/number'

import pDate from 'src/plugins/date'

import pCloseoverlay from 'src/plugins/close-overlay'

import pClipboard from 'src/plugins/clipboard'

import pIntro from 'src/plugins/intro'

import pGoogleanalytics from 'src/plugins/google-analytics'

import pRaven from 'src/plugins/raven'

import pAggrid from 'src/plugins/ag-grid'

import pItem from 'src/plugins/item'

import pBom from 'src/plugins/bom'

import pAudit from 'src/plugins/audit'

import pProcess from 'src/plugins/process'

import pProject from 'src/plugins/project'

import pCompany from 'src/plugins/company'














const { app, store, router } = createApp()




;[pAxios,pAlert,pAuth,pComponents,pValidate,pNumber,pDate,pCloseoverlay,pClipboard,pIntro,pGoogleanalytics,pRaven,pAggrid,pItem,pBom,pAudit,pProcess,pProject,pCompany].forEach(plugin => {
  plugin({
    app,
    router,
    store,
    Vue,
    ssrContext: null
  })
})









new Vue(app)






