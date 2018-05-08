<template>
  <div class="justify-center row fit">
    <q-checkbox v-model="params.value" :disable="!editable" @input="_onInput"></q-checkbox>
  </div>
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
