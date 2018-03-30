<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    async created () {
      await this.$auth.init()
      const store = this.$store
      const router = this.$router
      const routeTo = store.getters['route/to']
      if (routeTo) {
        const authorized = await store.dispatch('auth/authenticate', routeTo.meta.authorize)
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
