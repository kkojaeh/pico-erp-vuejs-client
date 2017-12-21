<template>

  <div class="row">

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="perm_identity" helper="회사를 식별하는 아이디를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.id.$error" :error-label="getErrorLabel(this.$v.model.id)">
          <q-input v-model="model.id" float-label="코드" :readonly="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="회사 이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.name.$error"
                 :error-label="getErrorLabel(this.$v.model.name)">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field ref="registrationOrDunsNo" icon="email" helper="사업자등록번호 또는 D-U-N-S Number 를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.registrationOrDunsNo.$error"
                 :error-label="getErrorLabel(this.$v.model.registrationOrDunsNo)">
          <c-cleave-input v-model="model.registrationOrDunsNo" type="email"
                          :cleave-options="{ delimiter: '-', blocks: [3, 2, 5]}"
                          float-label="사업자등록 번호 또는 D-U-N-S Number"/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 사용할 수 없게 됩니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        연락처 및 기타
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="account_circle" helper="대표자 이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.representative.$error"
                 :error-label="getErrorLabel(this.$v.model.representative)">
          <q-input v-model="model.representative" float-label="이름"/>
        </q-field>

        <q-field icon="fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.mobilePhoneNumber.$error"
                 :error-label="getErrorLabel(this.$v.model.mobilePhoneNumber)">
          <c-phone-input v-model="model.mobilePhoneNumber" float-label="핸드폰 번호" clearable />
        </q-field>

        <q-field icon="phone" helper="전화 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.telephoneNumber.$error"
                 :error-label="getErrorLabel(this.$v.model.telephoneNumber)">
          <c-phone-input v-model="model.telephoneNumber" float-label="전화번호" clearable/>
        </q-field>

        <q-field icon="fa-fax" helper="FAX 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.faxNumber.$error"
                 :error-label="getErrorLabel(this.$v.model.faxNumber)">
          <c-phone-input v-model="model.faxNumber" float-label="FAX 번호" clearable/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-toolbar>
      <q-btn flat icon="arrow_back" @click="$emit('close')" v-if="closable">이전</q-btn>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
      <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
    </q-toolbar>

  </div>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {CompanyModel} from './CompanyModel';
  import {positive, confirm, warning, getErrorLabel, phoneNumber} from 'src/util';
  import {required, minLength, maxLength} from 'vuelidate/lib/validators';
  // import Cleave from 'cleave.js';

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
    data() {
      return {
        isRegistrationNumber: true,
        model: {
          enabled: true
        },
        creating: false,
        enabled: true
      };
    },
    validations() {
      return {
        model: {
          id: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(50)
          },
          name: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(50)
          },
          registrationOrDunsNo: {
            minLength: minLength(1),
            maxLength: maxLength(20)
          },
          representative: {
            minLength: minLength(1),
            maxLength: maxLength(20)
          },
          mobilePhoneNumber: {
            minLength: minLength(2),
            maxLength: maxLength(20),
            phoneNumber
          },
          faxNumber: {
            minLength: minLength(2),
            maxLength: maxLength(20),
            phoneNumber
          },
          telephoneNumber: {
            minLength: minLength(2),
            maxLength: maxLength(20),
            phoneNumber
          }
        }
      };
    },
    mounted() {
      this.$nextTick(() => this[this.action]());
    },
    methods: {
      getErrorLabel,
      create() {
        this.creating = true;
        this.model = new CompanyModel({
          registrationOrDunsNo: '1111111111',
          mobilePhoneNumber: '+821091526830',
          enabled: true
        });
      },
      show() {
        this.creating = false;
        this.model = new CompanyModel({
          id: this.id,
          enabled: true
        });
        this.model.id = this.id;
        this.model.fetch();
      },
      _onSaveClick() {
        this.$v.model.$touch();
        if (this.$v.model.$error) {
          warning('입력이 유효하지 않습니다');
        } else {
          confirm('저장 하시겠습니까?').then((ok) => {
            if (ok) {
              this.save().then(() => {
                positive('저장 되었습니다');
                this.$emit('close');
              });
            }
          });
        }
      },
      save() {
        return new Promise((resolve, reject) => {
          if (this.creating) {
            this.model.create().then(resolve).catch(reject);
          } else {
            this.model.update().then(resolve).catch(reject);
          }
        });
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {}
  };
</script>
