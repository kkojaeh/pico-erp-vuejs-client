<template>
  <q-modal ref="modal" @hide="__onModalHide" class="modal-router-view" no-route-dismiss
           :maximized="maximized">
    <q-btn
        round
        color="primary"
        @click="__maximize"
        class="fixed gt-sm"
        icon="maximize"
        style="right: 18px; top: 18px"
        v-if="!maximized"
    />
    <q-btn
        round
        color="primary"
        @click="__minimize"
        class="fixed gt-sm"
        icon="minimize"
        style="right: 18px; top: 18px"
        v-if="maximized"
    />
    <component ref="component" :is="component" v-bind="$props"></component>
  </q-modal>
</template>
<script>

  export default {
    name: 'modal-router-view',
    methods: {
      __onModalHide() {
        this.$emit('hide')
      },
      __maximize() {
        this.maximized = true
      },
      __minimize() {
        this.maximized = false
      }
    },
    mounted () {
      window.qq = this.$q
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    }
  }
</script>