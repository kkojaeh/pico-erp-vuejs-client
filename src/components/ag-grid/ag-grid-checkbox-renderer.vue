<template>
  <q-checkbox v-model="params.value" :disable="!editable" @input="_onInput"></q-checkbox>
</template>

<script>
  export default {
    name: 'ag-grid-checkbox-renderer',
    methods: {
      _onInput (value) {
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
