<template>

  <q-page class="row">

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        견적 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="perm_identity" helper="회사를 식별하는 아이디를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <c-cleave-input v-model="model.id" float-label="코드" :readonly="!creating" clearable
                          :cleave-options="{uppercase:true, blocks: [5]}"
                          class="ime-mode-disabled" :hide-underline="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="회사 이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" clearable/>
        </q-field>

        <q-field ref="registrationNumber" icon="email" helper="사업자(또는 DUNS)번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.registrationNumber"
                 :error-label="model.$errors.registrationNumber">
          <c-cleave-input v-model="model.registrationNumber" type="text"
                          :cleave-options="{ numericOnly: true, delimiter: '-', blocks: [3, 2, 5]}"
                          float-label="사업자(DUNS)번호" clearable/>
        </q-field>

        <q-field icon="account_circle" helper="대표자 이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.representative"
                 :error-label="model.$errors.representative">
          <q-input v-model="model.representative" float-label="대표자" clearable/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 사용할 수 없게 됩니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled"/>
        </q-field>

        <q-field icon="fa-building" helper="업체의 유형을 선택하세요 체크여부에 따라 각 대상에서 제외됩니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <div class="row justify-between">
            <q-checkbox label="공급사" v-model="model.supplier"/>
            <q-checkbox label="고객사" v-model="model.customer"/>
            <q-checkbox label="외주사" v-model="model.outsourcing"/>
          </div>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        연락처 및 기타
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.mobilePhoneNumber" float-label="핸드폰 번호" clearable/>
        </q-field>

        <q-field icon="phone" helper="전화 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.telephoneNumber"
                 :error-label="model.$errors.telephoneNumber">
          <c-phone-number-input v-model="model.telephoneNumber" float-label="전화번호" clearable/>
        </q-field>

        <q-field icon="fa-fax" helper="FAX 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.faxNumber"
                 :error-label="model.$errors.faxNumber">
          <c-phone-number-input v-model="model.faxNumber" float-label="FAX 번호" clearable/>
        </q-field>

        <q-field icon="fa-map-marker" helper="회사의 주소를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3">
          <c-address-input v-model="model.address"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-toolbar>
      <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
      <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
             v-show="!creating">이력
        <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
          <audit-viewer ref="auditViewer" :url="`/audit/company/${model.id}`"></audit-viewer>
        </q-modal>
      </q-btn>
      <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
    </q-toolbar>

  </q-page>

</template>
<script>
  import { mapGetters } from 'vuex'
  import { QuotationModel } from 'src/model/quotation'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: new QuotationModel(),
        creating: false,
        enabled: true
      }
    },
    mounted () {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async create () {
        this.creating = true
        this.model = new QuotationModel()
      },
      async show () {
        this.creating = false
        this.model = await QuotationModel.get(this.id)
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateCreate()
          : await this.model.validateUpdate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              this.$closeOverlay()
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save () {
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {
      AuditViewer
    }
  }
</script>
