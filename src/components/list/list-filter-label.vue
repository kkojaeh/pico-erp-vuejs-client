<template>
  <q-chip v-show="visible" :closable="!immutable" color="primary" small detail square
          @hide="_onHide">
    <div class="q-toolbar-subtitle">{{label}}</div>
    {{prefix}} {{printedValue}} {{suffix}}
  </q-chip>
</template>

<script>
  import { date } from 'quasar'

  export default {
    name: 'c-list-filter-label',
    props: {
      value: null,
      label: {
        required: true
      },
      prefix: '',
      suffix: '',
      immutable: {
        type: Boolean,
        default: false
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      trueLabel: {
        type: String
      },
      falseLabel: {
        type: String
      },
      printValue: {
        type: String
      },
      clearValue: {
      }
    },
    data () {
      return {
        model: null
      }
    },

    methods: {
      _onHide () {
        this.$emit('input', this.clearValue)
        this.$emit('remove')
      },

      print (value) {
        if (value instanceof Date) {
          return date.formatDate(value, this.dateFormat)
        }
        if (typeof value == 'boolean') {
          return value === true ? this.trueLabel : this.falseLabel
        }
        return value
      }
    },

    watch: {
      value (to, from) {
        this.model = this.print(to)
      }
    },
    computed: {
      visible () {
        const value = this.model
        if (value instanceof Array) {
          return value.length > 0
        } else {
          return !!value
        }
      },
      printedValue () {
        return this.printValue || this.model || ''
      }
    },
    mounted () {
      this.model = this.print(this.value)
    },
    destroyed () {

    }
  }
</script>

<style>
</style>
