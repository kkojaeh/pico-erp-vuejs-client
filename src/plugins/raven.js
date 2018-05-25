import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

const ravenUrl = document.querySelector('meta[name=raven-url]').content

export default ({app, router, Vue}) => {
  if (ravenUrl) {
    Raven
    .config(ravenUrl)
    .addPlugin(RavenVue, Vue)
    .install()
  }
}
