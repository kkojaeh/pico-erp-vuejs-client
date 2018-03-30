<template>
  <div>{{value()}}</div>
</template>

<script>
  import { date } from 'quasar'

  export default {
    name: 'ag-grid-date-renderer',
    methods: {
      value () {
        return date.formatDate(this.params.value, 'YYYY-MM-DD')
      }
    },
    mounted () {
    }
  }
</script>

<style>
</style>
