<template>
  <div class="row items-center fit purchase-request-item-spec-cell-renderer">
    <div class="purchase-request-item-spec-cell-renderer-label">{{value}}</div>
    <q-btn icon="open_in_new" flat v-show="openable" @click="open"></q-btn>
  </div>
</template>

<script>
  export default {
    computed: {
      openable() {
        return this.params.data.item.specifiable
      },
      data() {
        return this.params.data
      },
      value() {
        const itemSpec = this.params.data.itemSpec
        if (itemSpec) {
          return itemSpec.summary
        }
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
  .purchase-request-item-spec-cell-renderer-label
    text-overflow: ellipsis
    overflow: hidden

  .purchase-request-item-spec-cell-renderer
    flex-wrap: nowrap !important
    .q-btn
      padding: 5px 5px

</style>