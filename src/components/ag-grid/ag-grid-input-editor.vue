<template>
  <q-input :type="type" ref="input" v-model="model"
           :maxlength="maxlength" :align="align"
           :decimals="decimals" :prefix="prefix" :suffix="suffix"></q-input>
</template>

<script>
  // import Vue from 'vue';

  export default {
    name: 'ag-grid-input-editor',
    methods: {
      refresh () {
      },
      getValue () {
        const setValue = this.params.setValue
        if (setValue) {
          return setValue(this.model)
        } else {
          return this.model
        }
      },
      isPopup () {
        return false
      },
      afterGuiAttached () {
        const getValue = this.params.getValue
        if (getValue) {
          this.model = getValue(this.params.value)
        } else {
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
        model: ''
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
    mounted () {
      this.$el.querySelector('input').addEventListener('input', (event) => {
        this.model = event.target.value
      })
    }
  }
</script>

<style>
</style>
