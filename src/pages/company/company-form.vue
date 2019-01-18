<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        회사 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="회사를 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <c-cleave-input v-model="model.id" float-label="코드" :readonly="!phantom"
                          :cleave-options="{uppercase:true, blocks: [5]}"
                          class="ime-mode-disabled" :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle" helper="회사 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field icon="email" helper="등록번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.registrationNumber"
                 :error-label="model.$errors.registrationNumber">
          <c-cleave-input v-model="model.registrationNumber"
                          :cleave-options="{ numericOnly: true, delimiter: '-', blocks: [3, 2, 5]}"
                          float-label="등록번호"/>
        </q-field>

        <q-field icon="account_circle" helper="대표자 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.representative"
                 :error-label="model.$errors.representative">
          <q-input v-model="model.representative" float-label="대표자"/>
        </q-field>

        <q-field icon="account_circle" helper="업태를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.conditionDescription"
                 :error-label="model.$errors.conditionDescription">
          <q-input v-model="model.conditionDescription" float-label="업태"/>
        </q-field>

        <q-field icon="account_circle" helper="종목을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.itemDescription"
                 :error-label="model.$errors.itemDescription">
          <q-input v-model="model.itemDescription" float-label="종목"/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 사용할 수 없게 됩니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled"/>
        </q-field>

        <q-field icon="fas fa-building" helper="업체의 유형을 선택하세요 체크여부에 따라 각 대상에서 제외됩니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-4">
          <div class="row justify-between">
            <q-checkbox label="공급사" v-model="model.supplier"/>
            <q-checkbox label="고객사" v-model="model.customer"/>
            <q-checkbox label="외주사" v-model="model.outsourcing"/>
          </div>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        연락처
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="addContact"
                 v-if="$authorized.companyManager"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.contact"
                 @click="removeContact" v-if="$authorized.companyManager"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 ref="contactGrid"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="true"
                 suppress-no-rows-overlay
                 @selection-changed="onContactSelectionChanged"
                 :row-data="contacts"
        >

          <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
          <ag-grid-column field="contact.name" header-name="이름" :width="150" :editable="true"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"/>

          <ag-grid-column field="contact.email" header-name="이메일" :width="150" :editable="true"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50, type: 'email' }"/>

          <ag-grid-column field="contact.mobilePhoneNumber" header-name="휴대폰 번호" :width="150"
                          :editable="true"
                          cell-renderer-framework="ag-grid-phone-number-renderer"
                          cell-editor-framework="ag-grid-phone-number-editor"/>

          <ag-grid-column field="contact.telephoneNumber" header-name="전화번호" :width="150"
                          :editable="true"
                          cell-renderer-framework="ag-grid-phone-number-renderer"
                          cell-editor-framework="ag-grid-phone-number-editor"/>

          <ag-grid-column field="contact.faxNumber" header-name="FAX 번호" :width="150"
                          :editable="true"
                          cell-renderer-framework="ag-grid-phone-number-renderer"
                          cell-editor-framework="ag-grid-phone-number-editor"/>
          <ag-grid-column field="enabled" header-name="사용여부" :width="90" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>

        </ag-grid>

      </q-card-main>


    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        주소지
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="addAddress"
                 v-if="$authorized.companyManager"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.address"
                 v-if="$authorized.companyManager"
                 @click="removeAddress"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 ref="addressGrid"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="true"
                 suppress-no-rows-overlay
                 @selection-changed="onAddressSelectionChanged"
                 :row-data="addresses"
        >

          <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
          <ag-grid-column field="name" header-name="이름" :width="150" :editable="true"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"/>

          <ag-grid-column field="mobilePhoneNumber" header-name="휴대폰 번호" :width="150"
                          :editable="true"
                          cell-renderer-framework="ag-grid-phone-number-renderer"
                          cell-editor-framework="ag-grid-phone-number-editor"/>

          <ag-grid-column field="telephoneNumber" header-name="전화번호" :width="150"
                          :editable="true"
                          cell-renderer-framework="ag-grid-phone-number-renderer"
                          cell-editor-framework="ag-grid-phone-number-editor"/>
          <ag-grid-column field="" header-name="" :width="40" suppress-sorting
                          cell-renderer-framework="ag-grid-icon-renderer"
                          :cell-renderer-params="{handler:onAddressSearch, icon:'search', link:true}"/>
          <ag-grid-column field="address.postalCode" header-name="우편번호" :width="90"
                          :cell-style="{textAlign: 'center'}"/>
          <ag-grid-column field="address.street" header-name="주소" :width="220"/>
          <ag-grid-column field="address.detail" header-name="상세주소" :width="180" :editable="true"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"/>
          <ag-grid-column field="enabled" header-name="사용여부" :width="90" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>

        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat color="tertiary" icon="fas fa-history"
               @click="$showAudit(`/audit/company/${model.id}`)"
               v-show="!phantom" label="이력" v-if="$authorized.companyManager">
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"
               v-if="$authorized.companyManager"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {
    CompanyAddressArray,
    CompanyAddressModel,
    CompanyContactArray,
    CompanyContactModel,
    CompanyModel
  } from 'src/model/company'
  import {AddressSelector} from 'src/model/data'

  export default {
    authorized: {
      'companyManager': 'hasRole(\'COMPANY_MANAGER\')'
    },
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
    data() {
      return {
        model: new CompanyModel(),
        contacts: new CompanyContactArray(),
        addresses: new CompanyAddressArray(),
        enabled: true,
        selected: {
          contact: null,
          address: null
        }
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async create() {
        this.model = new CompanyModel()
        this.contacts = new CompanyContactArray(this.model)
        this.addresses = new CompanyAddressArray(this.model)
      },
      async load(id) {
        const model = await CompanyModel.get(id)
        const contacts = new CompanyContactArray(model)
        const addresses = new CompanyAddressArray(model)
        await addresses.fetch()
        await contacts.fetch()
        this.model = model
        this.contacts = contacts
        this.addresses = addresses
      },
      async show() {
        this.load(this.id)
      },
      onContactSelectionChanged(event) {
        this.selected.contact = event.api.getSelectedRows()[0]
      },

      onAddressSelectionChanged(event) {
        this.selected.address = event.api.getSelectedRows()[0]
      },

      async onAddressSearch(data) {
        const selector = new AddressSelector()
        const address = await selector.select(data.address.street)
        data.address.postalCode = address.postalCode
        data.address.street = address.street
        data.address.detail = null
        this.$redrawGrids()
      },

      async onSaveClick() {
        const valid = ![
          await this.model.validate(),
          await this.contacts.validate(),
          await this.addresses.validate()
        ].includes(false)

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
                return
              }
            }
            this.load(this.model.id)
          }
        } else {
          this.$redrawGrids()
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
        await this.contacts.save()
        await this.addresses.save()
      },

      async addContact() {
        this.contacts.push(new CompanyContactModel())
      },

      async removeContact() {
        const name = this.selected.contact.contact.name || '이름 없음'
        const ok = await this.$alert.confirm(`'${name}' 의 연락처를 삭제 하시겠습니까?`)
        if (ok) {
          this.contacts.remove(this.selected.contact)
        }
      },

      async addAddress() {
        this.addresses.push(new CompanyAddressModel())
      },

      async removeAddress() {
        const name = this.selected.address.name || '이름 없음'
        const ok = await this.$alert.confirm(`'${name}' 의 주소지를 삭제 하시겠습니까?`)
        if (ok) {
          this.addresses.remove(this.selected.address)
        }
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    components: {
    }
  }
</script>
