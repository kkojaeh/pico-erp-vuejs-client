<template>
  <router-link :to="{path: routerPath, query:routerQuery, name:routerName, params: routerParams}"
               v-html="value">
  </router-link>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    name: 'ag-grid-router-link-renderer',
    computed: {
      value() {
        if (this.params.innerRenderer) {
          return this.params.innerRenderer(this.params)
        }
        return this.params.value
      },
      routerPath() {
        return _.template(this.params.path)(this.params.data)
      },
      routerQuery() {
        return this.params.query
      },
      routerName() {
        return this.params.name
      },
      routerParams() {
        return this.params.params
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: underline;
    padding: 10px 20px 10px 0px;
  }
</style>
