<template>
  <div id="q-app">
    <q-ajax-bar ref="ajaxBar"/>
    <router-view/>
  </div>
</template>

<script>
  import {authenticate} from 'src/plugins/auth'

  export default {
    name: 'App',
    async created () {
      await this.$auth.init()
      const store = this.$store
      const router = this.$router
      const routeTo = store.getters['route/to']
      if (routeTo) {
        const authorized = authenticate(routeTo.meta.authorize)
        if (authorized) {
          const routeNext = store.getters['route/next']
          routeNext()
        } else {
          store.commit('route/lastAccessed', routeTo)
          router.push('/sign-in')
        }
      }
    }
  }
</script>

<style>
</style>
