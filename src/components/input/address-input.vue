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
      find () {
        let width = 500
        let height = 600
        let p = new PostCode({
          oncomplete: (data) => {
            this.$set(this.model, 'postalCode', data.zonecode)
            this.$set(this.model, 'street', data.roadAddress)
            this.$set(this.model, 'detail', null)
          }
        })
        // open({q: '검색어', left: '팝업위치 x값', top: '팝업위치 y값', popupName: '팝업이름', autoClose: '자동닫힘유무'})
        p.open({
          q: this.model.street,
          popupName: 'address-input-popup',
          left: (window.screen.width / 2) - (width / 2),
          top: (window.screen.height / 2) - (height / 2)
          // autoClose: true
        })
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