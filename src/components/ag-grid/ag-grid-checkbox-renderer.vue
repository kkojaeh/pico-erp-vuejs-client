<template>
  <q-checkbox v-model="params.value" :disable="!editable" @change="_onChange"></q-checkbox>
</template>

<script>
  export default {
    name: 'ag-grid-checkbox-renderer',
    methods: {
      _onChange (value) {
        this.params.setValue(value)
      },
      refresh () {
      }
    },
    computed: {
      editable () {
        return this.params.column.isCellEditable(this.params.node)
      }
    }
  }
</script>

<style>
</style>
