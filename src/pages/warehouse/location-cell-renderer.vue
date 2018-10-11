<template>
  <div class="row items-center fit location-cell-renderer">
    <div class="col-grow location-cell-renderer-label" v-html="label"></div>
    <q-btn icon="edit" v-if="isCellFocused" flat @click="onEdit"></q-btn>
  </div>
</template>

<script>

  export default {
    computed: {

      isCellFocused() {
        const focused = this.params.api.getFocusedCell()
        if (focused) {
          return focused.column == this.params.column && focused.rowIndex == this.params.rowIndex
        } else {
          return false
        }
      },
      label() {
        const renderer = this.params.innerRenderer
        return renderer ? renderer(this.params) : this.params.value
      }
    },
    methods: {
      onEdit() {
        const handler = this.params.editHandler
        if (handler) {
          handler(this.params.data)
        }
      },
    }
  }
</script>
<style lang="stylus">
  .location-cell-renderer-label
    text-overflow: ellipsis
    overflow: hidden

  .location-cell-renderer
    flex-wrap: nowrap !important
    .q-btn
      padding: 5px 5px
</style>