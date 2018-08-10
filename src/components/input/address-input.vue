<template>
  <div class="col address-input-container">
    <q-input float-label="우편번호"
             v-model="model.postalCode" readonly
             :after="[
              { icon:'search', handler:find, condition: visibleSearch },
              { icon:'clear', handler:clear, condition: visibleClear }
             ]">
    </q-input>

    <q-input float-label="도로주소" v-model="model.street" readonly></q-input>
    <q-input float-label="상세주소" v-model="model.detail"></q-input>
  </div>
</template>

<script>
  import InputMixin from './input-mixin'
  import {AddressSelector} from 'src/model/data'

  export default {
    name: 'c-address-input',
    mixins: [InputMixin],
    props: {
      value: {
        type: Object
      }
    },
    data () {
      return {
        model: {}
      }
    },
    computed: {
      visibleSearch() {
        return !(this.disable || this.readonly)
      },
      visibleClear() {
        return !(this.disable || this.readonly) && this.exists
      },
      exists () {
        return !!(this.model.postalCode || this.model.street || this.model.detail)
      }
    },
    methods: {
      async find () {
        const selector = new AddressSelector()
        const address = await selector.select(this.model.street)
        this.$set(this.model, 'postalCode', address.postalCode)
        this.$set(this.model, 'street', address.street)
        this.$set(this.model, 'detail', null)
      },
      clear () {
        this.model.postalCode = null
        this.model.street = null
        this.model.detail = null
      }
    },
    watch: {
      model: {
        handler (to, from) {
          this.$emit('input', to)
        },
        deep: true
      },
      value (to) {
        this.model = to || {}
      }
    },
    mounted () {
      this.model = this.value
    }
  }
</script>
<style lang="stylus">
  .address-input-container
    > *
      margin-bottom: 5px
    :last-child
      margin-bottom: 0px
</style>