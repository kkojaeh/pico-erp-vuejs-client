<template>
  <q-modal ref="modal" @hide="_onModalHide" class="modal-router-view">
    <div ref="container"></div>
  </q-modal>
</template>
<script>
  import router from 'src/router'
  import store from 'src/store'

  export default {
    name: 'modal-router-view',
    methods: {
      _onModalHide () {
        if (this.onModalHide) {
          this.onModalHide()
        }
      },
      _onComponentClose () {
        this.$refs.modal.hide()
      }
    },
    mounted () {
      let component = new this.component({// eslint-disable-line
        el: this.$refs.container,
        store,
        router,
        propsData: this.$props
      }) // .$mount();
      component.$on('close', this._onComponentClose)
      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    }
  }
</script>
<style>
  .modal-router-view > * {
    min-height: 10vh;
  }

  .modal-router-view .q-layout {
    min-height: 10vh;
    min-width: 70vw;
    max-width: 90vw;

  }

  /*
  max-height: 80vh;
   */
</style>