<template>
  <div class="col gutter-sm">
    <div class="row justify-between with-padding">
      <q-input class="col-4 no-padding" style="min-width:100px;" float-label="우편번호"
               v-model="model.postalCode" readonly></q-input>
      <div class="col-7 no-padding row justify-end">
        <q-btn flat icon="search" @click="find()" v-if="!(disable || readonly)"></q-btn>
        <q-btn flat icon="clear" @click="clear()" v-if="!(disable || readonly) && exists"></q-btn>
      </div>
    </div>
    <div>
      <q-input float-label="도로주소" v-model="model.street" readonly></q-input>
    </div>
    <div>
      <q-input float-label="상세주소" v-model="model.detail"></q-input>
    </div>
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