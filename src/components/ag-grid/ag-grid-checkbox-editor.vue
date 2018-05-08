<template>
  <q-checkbox ref="checkbox" v-model="params.value"
              @input="_onInput"></q-checkbox>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-checkbox-editor',
    methods: {
      _onInput (value) {
        this.params.api.stopEditing()
      },
      refresh () {
      },
      getValue () {
        return this.params.value
      },
      isPopup () {
        return false
      },
      afterGuiAttached () {
        this.$nextTick(() => {
          this.$refs.checkbox.focus()
        })
      }
    },
    computed: {}
  }
</script>

<style>
</style>
