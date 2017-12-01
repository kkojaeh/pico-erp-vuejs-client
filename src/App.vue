<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout
      ref="layout"
      view="lHh Lpr fff"
      :left-class="{'bg-grey-2': true}"
    >
      <main-drawer slot="left"></main-drawer>
      <main-toolbar></main-toolbar>

      <router-view/>
    </q-layout>
  </div>
</template>
<script>
  import MainToolbar from './components/layout/MainToolbar.vue'
  import MainDrawer from './components/layout/MainDrawer.vue'

  /*
   * Root component
   */
  export default {
    components: {
      MainToolbar,
      MainDrawer
    }
  }
</script>

<style></style>
