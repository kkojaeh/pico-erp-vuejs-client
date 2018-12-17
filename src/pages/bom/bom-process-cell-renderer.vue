<template>
  <div class="row items-center fit bom-process-cell-renderer">
    <div class="bom-process-cell-renderer-label">{{label}}</div>
    <q-btn icon="open_in_new" flat v-show="openable" @click="open"></q-btn>
  </div>
</template>

<script>

  export default {
    computed: {
      openable() {
        if (this.params.data.updatable && this.params.data.processable) {
          return true
        }
        if (this.params.data.processes && this.params.data.processes.length) {
          return true
        }
        return false
      },
      label () {
        const label = this.params.data.processesNames
        return label || 'N/A'
      }
    },
    methods: {
      open() {
        const handler = this.params.openHandler
        if (handler) {
          handler(this.params.data)
        }
      }
    }
  }
</script>
<style lang="stylus">
  .bom-process-cell-renderer-label
    text-overflow: ellipsis
    overflow: hidden

  .bom-process-cell-renderer
    flex-wrap: nowrap !important
    .q-btn
      padding: 5px 5px

</style>