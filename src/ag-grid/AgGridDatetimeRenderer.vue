<template>
  <div>{{value()}}</div>
</template>

<script>
  import {date} from 'quasar';

  export default {
    name: 'ag-grid-datetime-renderer',
    methods: {
      value() {
        return date.formatDate(this.params.value, 'YYYY-MM-DD HH:mm:ss');
      }
    },
    mounted() {
    }
  };
</script>

<style>
</style>
