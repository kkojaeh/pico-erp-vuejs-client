import VueAnalytics from 'vue-ua'
import Router from 'src/router'

const appName = document.querySelector(
  'meta[name=google-analytics-app-name]').content
const trackingId = document.querySelector(
  'meta[name=google-analytics-tracking-id]').content

export default ({app, router, Vue}) => {
  if (appName && trackingId) {
    Vue.use(VueAnalytics, {
      appName: appName,
      appVersion: version,
      trackingId: trackingId,
      // Whether or not display console logs debugs (optional)
      debug: false,
      // Pass the router instance to automatically sync with router (optional)
      vueRouter: Router,
      // If router, you can exclude some routes name (case insensitive) (optional)
      ignoredViews: [],
      // Whether you want page changes to be recorded as pageviews (website) or screenviews (app), default: false
      trackPage: true
    })
  }
}
