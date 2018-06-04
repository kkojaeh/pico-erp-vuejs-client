<template>
  <div class="row items-center fit bom-process-cell-renderer">
    <div class="col-grow bom-process-cell-renderer-label">{{label}}</div>
    <q-btn icon="add_circle" flat v-show="isAddable" @click="edit"></q-btn>
    <q-btn icon="settings" flat v-show="isLinkable" @click="edit"></q-btn>
    <q-btn icon="remove_circle" flat v-show="isRemovable" @click="remove"></q-btn>
  </div>
</template>

<script>

  export default {
    computed: {
      isAddable () {
        return !this.params.value && this.data.modifiable
      },
      isLinkable () {
        return this.params.value
      },
      isRemovable () {
        return this.params.value && this.data.modifiable
      },
      label () {
        return this.data.processId ? this.data.process.name : 'N/A'
      },
      data () {
        return this.params.data
      }
    },
    methods: {
      edit () {
        const handler = this.params.editHandler
        if (handler) {
          handler(this.params.data)
        }
      },
      remove () {
        const handler = this.params.removeHandler
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