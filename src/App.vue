<template>
  <!-- Don't drop "q-app" class -->
  <!--<div class="q-app">-->
  <q-layout
      ref="layout"
      view="lHh Lpr fff"
      :left-class="{'bg-grey-2': true}"
  >
    <main-drawer slot="left" v-if="frameNeeded"></main-drawer>
    <main-toolbar slot="header" v-if="frameNeeded"
                  @toggle="$refs.layout.toggleLeft()"></main-toolbar>

    <router-view/>
  </q-layout>
  <!--</div>-->
</template>
<script>
  import {mapGetters} from 'vuex';
  import MainToolbar from './components/layout/MainToolbar.vue';
  import MainDrawer from './components/layout/MainDrawer.vue';

  /*
   * Root component
   */
  export default {
    created() {
    },
    computed: {
      ...mapGetters(['frameNeeded'])
    },
    components: {
      MainToolbar,
      MainDrawer
    },
    methods: {}
  };
</script>

<style></style>
