import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import store from 'src/store'

const ravenUrl = document.querySelector('meta[name=raven-url]').content

export default ({app, router, Vue}) => {
  if (ravenUrl) {
    Raven
    .config(ravenUrl)
    .addPlugin(RavenVue, Vue)
    .install()
    store.subscribe((mutation) => {
      if (mutation.type == 'auth/user') {
        const email = mutation.payload ? mutation.payload.email : null
        const id = mutation.payload ? mutation.payload.id : null
        Raven.setUserContext({
          id: id,
          email: email
        })
      }
    })
  }
}
