import VueAnalytics from 'vue-ua'
import Router from 'src/router'
import {googleAnalytics, version} from 'src/plugins/config'

export default ({ app, router, Vue }) => {
  Vue.use(VueAnalytics, {
    appName: googleAnalytics.appName,
    appVersion: version,
    trackingId: googleAnalytics.trackingId,
    // Whether or not display console logs debugs (optional)
    debug: googleAnalytics.debug,
    // Pass the router instance to automatically sync with router (optional)
    vueRouter: Router,
    // If router, you can exclude some routes name (case insensitive) (optional)
    ignoredViews: [],
    // Whether you want page changes to be recorded as pageviews (website) or screenviews (app), default: false
    trackPage: true
  })
}
