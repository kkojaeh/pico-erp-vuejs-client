<template>
  <router-link :to="to">
    {{value}}
  </router-link>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    name: 'ag-grid-router-link-renderer',
    methods: {},
    computed: {
      to () {
        let location = {}
        if (this.params.path) {
          location.path = _.template(this.params.path)(this.params.data)
        }
        if (this.params.query) {
          location.query = this.params.query
        }
        if (this.params.name) {
          location.name = this.params.name
        }
        if (this.params.params) {
          location.params = this.params.params
        }
        return location
      },
      value () {
        return this.params.value
      }
    }
  }
</script>

<style scoped>
  a {
    text-decoration: underline;
    display: inline-block;
    width: 100%;
  }
</style>
