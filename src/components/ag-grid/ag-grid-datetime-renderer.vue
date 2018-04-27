<template>
  <div>{{value}} <sub>{{ago}}</sub></div>
</template>

<script>
  import { dateTimeFormat } from 'src/plugins/date'

  export default {
    name: 'ag-grid-datetime-renderer',
    computed: {
      value () {
        const value = this.params.value
        if(!value){
          return
        }
        return this.$date.format(value, this.params.format || dateTimeFormat)
      },
      ago () {
        const value = this.params.value
        if(!value){
          return
        }
        if(this.params.ago){
          return `(${this.$date.ago(value)})`
        }
      }
    }
  }
</script>

<style>
</style>
