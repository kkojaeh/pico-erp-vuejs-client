// import something here
const content = document.querySelector('meta[name=app-config]').content
const config = JSON.parse(decodeURIComponent(content))

export const firebaseConfig = config.firebase

export const apiBaseUrl = config.api.baseUrl
export const apiContentType = config.api.contentType

export const googleAnalytics = config.googleAnalytics

export const version = config.version

export default ({ app, router, Vue }) => {

  Vue.prototype.$version = version

}
