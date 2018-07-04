<template>
  <c-phone-number-input ref="input" v-model="model" clearable />
</template>

<script>
  export default {
    name: 'ag-grid-phone-number-editor',
    data () {
      return {
        model: ''
      }
    },
    methods: {
      getValue () {
        return this.model
      },
      isPopup () {
        return false
      },
      afterGuiAttached () {
        this.model = this.params.value
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  }
</script>
