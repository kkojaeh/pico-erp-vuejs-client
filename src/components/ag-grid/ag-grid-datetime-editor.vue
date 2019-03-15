<template>
  <q-datetime ref="input" v-model="params.value" :type="type" :format24h="format24h"
              @show="onShow"></q-datetime>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-datetime-editor',
    methods: {
      getValue() {
        return this.params.value
      },
      isPopup() {
        return true
      },
      afterGuiAttached() {
        this.$nextTick(() => {
          const popup = this.$refs.input.$refs.popup
          const domDataKey = this.params.api.gridOptionsWrapper.domDataKey
          // 바로 팝업이 열릴 때(this.$refs.input.show()) 포커스 아웃으로 인한 팝업 닫힘 방지
          popup.$el[domDataKey] = this.$el.parentElement[domDataKey]
          const activePopupElements = this.params.api.gridCore.popupService.activePopupElements
          popup.$once('show', () => {
            activePopupElements.push(popup.$el)
          })
          popup.$once('hide', () => {
            const index = activePopupElements.indexOf(popup.$el)
            activePopupElements.slice(index, 1)
            this.params.api.stopEditing()
          })
          this.$refs.input.show()
        })
      },
      onShow() {
      }
    },
    computed: {
      type() {
        return this.params.type || 'datetime'
      },
      format24h() {
        return !!this.params.format24h
      }
    }
  }
</script>

<style>
</style>
