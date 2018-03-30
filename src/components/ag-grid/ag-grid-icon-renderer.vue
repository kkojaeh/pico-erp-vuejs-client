<template>
  <q-icon :name="icon" size="1.5rem" v-if="icon" @click.native="_onIconClick"
          :class="[link ? 'link' : '' ]"/>
</template>

<script>
  import * as _ from 'lodash'

  export default {
    name: 'ag-grid-icon-renderer',
    methods: {
      _onIconClick () {
        if (this.params.handler) {
          this.params.handler(this.params.data)
        }
      }
    },
    computed: {
      link () {
        return !!this.params.link
      },
      icon () {
        return this.params.icon
      },
      value () {
        return this.params.value
      }
    }
  }
</script>

<style scoped>
  .link {
    cursor: pointer;
  }
</style>
