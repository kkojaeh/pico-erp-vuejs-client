<template>
  <q-checkbox ref="checkbox" v-model="params.value"
              @change="_onChange"></q-checkbox>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-checkbox-editor',
    methods: {
      _onChange(value) {
        this.params.api.stopEditing();
      },
      refresh() {
      },
      getValue() {
        return this.params.value;
      },
      isPopup() {
        return false;
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.$refs.checkbox.$el.focus();
      });
    }
  };
</script>

<style>
</style>
