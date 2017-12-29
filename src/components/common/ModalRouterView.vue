<template>
  <q-modal ref="modal" @close="_onModalClose">
    <div ref="container"></div>
  </q-modal>
</template>
<script>
  import router from 'src/config/router';
  import store from 'src/config/store';

  export default {
    name: 'modal-router-view',
    methods: {
      _onModalClose() {
        if (this.onModalClose) {
          this.onModalClose();
        }
      },
      _onComponentClose() {
        this.$refs.modal.close();
      }
    },
    mounted() {
      let component = new this.component({// eslint-disable-line
        el: this.$refs.container,
        store,
        router,
        propsData: this.$props
      }); // .$mount();
      component.$on('close', this._onComponentClose);
      this.$nextTick(() => {
        this.$refs.modal.open();
      });
    }
  };
</script>
