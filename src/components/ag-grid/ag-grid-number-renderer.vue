<template>
  <div class="ag-grid-number-renderer">{{value}} <sub v-if="visibleWords">({{words}})</sub></div>
</template>

<script>
  import SSF from 'ssf'

  export default {
    name: 'ag-grid-number-renderer',
    computed: {
      value() {
        const value = this.params.value
        if (isNaN(value)) {
          return
        }
        const format = this.params.format || 'General'
        return SSF.format(format, value)
      },
      words() {
        const value = this.params.value
        if (isNaN(value)) {
          return
        }
        if (this.params.words) {
          return this.$number.words(value)
        }
      },
      visibleWords() {
        return this.params.words && !isNaN(this.params.value)
      }

    }
  }
</script>

<style lang="stylus">
  .ag-grid-number-renderer
    position: relative
    sub
      position: absolute;
      bottom: 0px;
      right: 0px;
      line-height: initial;

</style>
