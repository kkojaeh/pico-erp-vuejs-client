<template>
  <div class="row items-center fit bom-item-spec-cell-renderer">
    <div class="col-grow bom-item-spec-cell-renderer-label">{{value}}</div>
    <q-btn icon="add_circle" flat v-show="isAddable" @click="edit"></q-btn>
    <q-btn icon="settings" flat v-show="isLinkable" @click="edit"></q-btn>
  </div>
</template>

<script>
  export default {
    computed: {
      isAddable () {
        return this.data.parent && !this.params.value && this.params.data.specifiable
      },
      isLinkable () {
        return this.data.parent && this.params.value && this.params.data.specifiable
      },
      data () {
        return this.params.data
      },
      form () {
        return this.params.form
      },
      value() {
        const itemSpec = this.params.data.itemSpec
        if(itemSpec){
          return itemSpec.summary
        }
      }
    },
    methods: {
      edit () {
        const handler = this.params.editHandler
        if (handler) {
          handler(this.params.data)
        }
      }
    }
  }
</script>
<style lang="stylus">
  .bom-item-spec-cell-renderer-label
    text-overflow: ellipsis
    overflow: hidden

  .bom-item-spec-cell-renderer
    .q-btn
      padding: 5px 5px

</style>