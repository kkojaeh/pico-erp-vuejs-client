<template>
  <q-datetime ref="input" v-model="params.value" :type="type" :format24h="format24h"></q-datetime>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-datetime-editor',
    methods: {
      onPopupHide() {
        //this.$refs.input.hide()
        this.$nextTick(() => {
          this.params.api.stopEditing()
        })
      },
      getValue() {
        return this.params.value
      },
      isPopup() {
        return false
      },
      afterGuiAttached() {
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.$refs.input.show()
            this.$refs.input.$refs.popup.$once('hide', this.onPopupHide)
          }
        })
      }
    },
    computed: {
      type() {
        return this.params.type || 'datetime'
      },
      format24h() {
        return !!this.params.format24h
      }
    }
  }
</script>

<style>
</style>
