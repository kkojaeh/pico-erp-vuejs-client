<template>
  <div>{{value()}}</div>
</template>

<script>
  export default {
    name: 'ag-grid-array-label-renderer',
    methods: {
      value () {
        const params = this.params
        const found = params.array.find(e => e[params.valueField] == params.value)
        return found ? found[params.labelField] : params.notFoundLabel || ''
      }
    },
    mounted () {
    }
  }
</script>

<style>
</style>
