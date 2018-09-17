// Configuration for your app
var fs = require('fs');
var webpack = require('webpack');



module.exports = function (ctx) {
  const env = {
    APP_VERSION: this.pkg.version
  }
  Object.assign(env, process.env)
  for(var key in env){
    env[key] = '"' + env[key] + '"'
  }
  return {
    plugins: [
      'axios',
      'alert',
      'auth',
      'components',
      'validate',
      'number',
      'date',
      'close-overlay',
      'clipboard',
      'intro',
      'google-analytics',
      'raven',
      'ag-grid',
      'item',
      'bom',
      'audit',
      'process',
      'project',
      'company'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      'fontawesome'
      // 'ionicons',
      // 'mdi',

    ],
    supportIE: true,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      env: env,
      scopeHoisting: true,
      vueRouterMode: 'history',
      gzip: true,
      /*
      analyze: {
        analyzerMode: 'server',
        analyzerHost: 'localhost',
        analyzerPort: '7000',
        reportFilename: 'index.html',
        defaultSizes: 'stat',
        openAnalyzer: true,
        generateStatsFile: true,
        statsFilename: 'stats.json',
        logLevel : 'warn'
      },
      */
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {

        const definePlugin = cfg.plugins.find(
            e => e instanceof webpack.DefinePlugin)
        const env = definePlugin.definitions['process.env']
        for (const name in env) {
          if (name.startsWith('TRAVIS_') || name == "__CF_USER_TEXT_ENCODING") {
            delete env[name]
          }
        }
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: 'all',
    // {
    //   components: [
    //     'QCard',
    //     'QCardMain',
    //     'QCardTitle',
    //     'QCardSeparator',
    //     'QCardActions',
    //     'QInput',
    //     'QField',
    //     'QLayout',
    //     'QLayoutHeader',
    //     'QLayoutFooter',
    //     'QLayoutDrawer',
    //     'QPageContainer',
    //     'QPage',
    //     'QToolbar',
    //     'QToolbarTitle',
    //     'QBtn',
    //     'QIcon',
    //     'QList',
    //     'QListHeader',
    //     'QItem',
    //     'QItemTile',
    //     'QItemMain',
    //     'QItemSide',
    //     'QItemSeparator',
    //     'QCollapsible',
    //     'QChip',
    //     'QToggle',
    //     'QSelect',
    //     'QPagination',
    //     'QModal',
    //     'QInputFrame',
    //     'QCheckbox',
    //     'QDatetime',
    //     'QTabs',
    //     'QTab',
    //     'QTabPane',
    //     'QAutocomplete',
    //     'QSlider',
    //     'QBtnDropdown',
    //     'QPageSticky',
    //     'QResizeObservable',
    //     'QTooltip',
    //     'QPopover',
    //     'QSpinner',
    //     'QUploader',
    //     'QBtnGroup',
    //     'QInnerLoading',
    //     'QDatetimePicker'
    //   ],
    //   directives: [
    //     'Ripple',
    //     'CloseOverlay'
    //   ],
    //   plugins: [
    //     'Dialog',
    //     'Notify',
    //     'Loading'
    //   ]
    //},
    // animations: 'all' --- includes all animations
    animations: [],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: 'pico.erp.client.vuejs'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
