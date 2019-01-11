<template>
  <q-modal ref="modal" @hide="_onModalHide" class="modal-router-view" no-route-dismiss
           :maximized="maximized">
    <component ref="component" :is="component" v-bind="$props"></component>
  </q-modal>
</template>
<script>

  export default {
    name: 'modal-router-view',
    methods: {
      _onModalHide () {
        this.$emit('hide')
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    }
  }
</script>