<template>
  <q-input :type="type" ref="input" v-model="model" @keyup.enter="_onEnter"
           :maxlength="maxlength" :align="align"
           :decimals="decimals" :prefix="prefix" :suffix="suffix"></q-input>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-input-editor',
    methods: {
      _onEnter (e) {
        this.params.api.stopEditing()
      },
      refresh () {
      },
      getValue () {
        return this.params.value
      },
      isPopup () {
        return false
      },
      afterGuiAttached () {
        const toValue = this.params.toValue
        if (toValue) {
          this.model = toValue(this.params.value)
        }else {
          this.model = this.params.value
        }
        this.$nextTick(() => {
          this.$refs.input.select()
          this.$refs.input.focus()
        })
      }
    },
    data () {
      return {
        model: null
      }
    },
    computed: {
      type () {
        return this.params.type || 'text'
      },
      maxlength () {
        return this.params.maxlength || 524288
      },
      decimals () {
        return this.params.decimals
      },
      prefix () {
        return this.params.prefix
      },
      suffix () {
        return this.params.suffix
      },
      align () {
        return this.params.align
      }
    },
    watch: {
      model (to) {
        const fromValue = this.params.fromValue
        if (fromValue) {
          this.params.value = fromValue(to)
        } else {
          this.params.value = to
        }
      }
    }
  }
</script>

<style>
</style>
