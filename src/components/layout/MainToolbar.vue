<template>
  <q-toolbar slot="header" class="glossy" v-show="isFrameNeeded">
    <q-btn flat @click="$refs.layout.toggleLeft()" >
      <q-icon name="menu" />
    </q-btn>

    <q-toolbar-title>
      Quasar App
      <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
    </q-toolbar-title>
  </q-toolbar>
  <!--
  <div class="toolbar" v-show="getLayoutNeeded">
    <q-ajax-bar color="#80cbc4"></q-ajax-bar>
    <router-link :to="'/'" v-if="$router.currentRoute.meta.backButton">
      <button>
        <i>arrow_back</i>
      </button>
    </router-link>
    <button class="hide-on-drawer-visible" @click="leftDrawer.open()" v-else >
      <i>menu</i>
    </button>
    <q-toolbar-title :padding="1">
      Quasar Admin App
    </q-toolbar-title>
    <div class="right-itens">
      <a @click="setMobileMode(true)" class="text-white gt-sm inline">
        <i class="fa fa-3x fa-mobile"></i>
      </a>
      <a href="https://github.com/odranoelBR/vue-quasar-admin-example" class="text-white">
        <i class="fa fa-2x fa-github"></i>
      </a>
    </div>
  </div>
  -->
</template>
<script type="text/javascript">
  import { mapMutations, mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['isFrameNeeded']),
      leftDrawer () {
        return null // this.$parent.$children[1].$refs.leftDrawer
      }
    },
    methods: {
      ...mapMutations(['setFrameNeeded'])
    },
    components: {
    }
  }
</script>
<style scoped>
  .toolbar{
    min-height: 60px;
  }
  .right-itens a, .right-itens button{
    margin-right: 10px;
  }
</style>
