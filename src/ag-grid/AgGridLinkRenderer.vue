<template>
  <router-link :to="to">
    <q-icon :name="icon" size="1.5rem" v-if="icon"/>
    {{value}}
  </router-link>
</template>

<script>
  import * as _ from 'lodash';

  export default {
    name: 'ag-grid-link-renderer',
    methods: {},
    computed: {
      to() {
        return {
          path: _.template(this.params.path)(this.params.data),
          query: this.params.query
        };
      },
      icon() {
        return this.params.icon;
      },
      value() {
        return this.params.value;
      }
    }
  };
</script>

<style scoped>
  a {
    text-decoration: underline;
  }
</style>
