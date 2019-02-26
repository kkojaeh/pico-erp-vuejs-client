<template>
  <q-card class="col-12" flat>

    <q-card-title>
      전달
    </q-card-title>

    <q-card-separator/>


    <q-card-main class="row">

      <q-field icon="send" helper="전송 방식"
               class="col-12"
               :error="!!model.$errors.method"
               :error-label="model.$errors.method">
        <div class="row">
          <q-radio v-model="model.method" val="FAX" label="FAX" class="col-5"/>
          <q-radio v-model="model.method" val="MAIL" label="이메일" class="col-5"/>
        </div>
      </q-field>


      <q-field icon="fas fa-fax" helper="FAX 번호를 입력하세요"
               class="col-12" v-if="isFax"
               :error="!!model.$errors.faxNumber"
               :error-label="model.$errors.faxNumber">

        <c-phone-number-input v-model="model.faxNumber"
                              float-label="FAX 번호"
                              class="ime-mode-disabled">
        </c-phone-number-input>
      </q-field>

      <q-field icon="mail" helper="이메일을 입력하세요"
               class="col-12" v-if="isMail"
               :error="!!model.$errors.mail"
               :error-label="model.$errors.mail">

        <q-input v-model="model.mail" type="email" float-label="이메일" class="ime-mode-disabled">
        </q-input>
      </q-field>

      <q-list class="col-12" link v-if="isFax">
        <q-item v-for="data in faxNumbers" :key="data.value"
                @click.native="model.faxNumber = data.value">
          <q-item-side left>
            <q-item-tile icon="fas fa-fax"/>
          </q-item-side>
          <q-item-main :label="data.label"/>
        </q-item>
      </q-list>

      <q-list class="col-12" link v-if="isMail">
        <q-item v-for="data in mails" :key="data.value" @click.native="model.mail = data.value">
          <q-item-side left>
            <q-item-tile icon="mail"/>
          </q-item-side>
          <q-item-main :label="data.label"/>
        </q-item>
      </q-list>

    </q-card-main>

    <q-card-actions align="between">
      <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
      <q-btn flat icon="send" @click="onDeliver()">전송</q-btn>
    </q-card-actions>

  </q-card>

</template>
<script>
  import {DeliveryModel} from 'src/model/delivery'

  export default {
    props: {
      id: {
        type: String
      },
      mails: {
        type: Array,
        default: () => []
      },
      faxNumbers: {
        type: Array,
        default: () => []
      },
      closable: {
        type: Boolean,
        default: false
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new DeliveryModel(),
        methods: [
          {label: 'FAX', value: 'FAX'},
          {label: '이메일', value: 'MAIL'}
        ]
      }
    },
    async mounted() {
      this.show()
    },
    methods: {
      async load(id) {
        this.model = await DeliveryModel.get(id)
      },
      async show() {
        await this.load(this.id)
      },
      async onDeliver() {
        let valid = await this.model.validateDeliver()
        if (valid) {
          const ok = await this.$alert.confirm('전송 하시겠습니까?')
          if (ok) {
            await this.model.deliver()
            this.$alert.positive('전송 되었습니다')
            if (this.closable && this.closeConfirmed) {
              this.$closeOverlay()
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      }

    },
    computed: {
      phantom() {
        return this.model.phantom
      },
      isFax() {
        return this.model.method == 'FAX'
      },
      isMail() {
        return this.model.method == 'MAIL'
      }
    },
    watch: {},
    components: {}
  }
</script>
