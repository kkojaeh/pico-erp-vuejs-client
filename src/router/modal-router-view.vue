<template>
  <q-modal ref="modal" @hide="_onModalHide" class="modal-router-view" no-route-dismiss>
    <component ref="component" :is="component" v-bind="$props"></component>
  </q-modal>
</template>
<script>
  import router from 'src/router'
  import store from 'src/store'
  import { api } from 'src/plugins/axios'

  export default {
    name: 'modal-router-view',
    methods: {
      _onModalHide () {
        if (this.onModalHide) {
          this.onModalHide()
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    }
  }
</script>