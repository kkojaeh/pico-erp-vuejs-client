<template>
  <div>{{value}} <sub v-if="visibleAgo">({{ago}})</sub></div>
</template>

<script>
  import {dateFormat} from 'src/plugins/date'

  export default {
    name: 'ag-grid-date-renderer',
    computed: {
      value () {
        const value = this.params.value
        if (!value) {
          return
        }
        return this.$date.format(value, this.params.format || dateFormat)
      },
      ago () {
        const value = this.params.value
        if (!value) {
          return
        }
        if (this.params.ago) {
          return this.$date.ago(value)
        }
      },
      visibleAgo() {
        return this.params.ago && this.params.value
      }
    }
  }
</script>

<style>
</style>
