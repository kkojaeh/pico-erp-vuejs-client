<template>
  <div class="col gutter-sm">
    <q-input class="col-8" style="min-width:150px;" float-label="우편번호"
             v-model="model.postalCode" readonly hide-underline>
      <q-btn flat icon="search" @click="find()" v-if="!(disable || readonly)"></q-btn>
      <q-btn flat icon="clear" @click="clear()" v-if="!(disable || readonly) && exists"></q-btn>
    </q-input>
    <q-input float-label="도로주소" v-model="model.street" readonly hide-underline></q-input>
    <q-input float-label="상세주소" v-model="model.detail"></q-input>
  </div>
</template>

<script>
  import InputMixin from './input-mixin'
  import {
    AddressSelector
  } from 'src/model/data'

  let PostCode = window.daum.Postcode

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
      exists () {
        return this.model.postalCode || this.model.street || this.model.detail
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