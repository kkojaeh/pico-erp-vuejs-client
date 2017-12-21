<template>

  <div class="row">

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="perm_identity" helper="아이디를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.id.$error" :error-label="getErrorLabel(this.$v.model.id)">
          <q-input v-model="model.id" float-label="아이디" :readonly="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.name.$error"
                 :error-label="getErrorLabel(this.$v.model.name)">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field icon="email" helper="사용하는 이메일을 입력하세요(로그인에 사용됩니다)"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.email.$error"
                 :error-label="getErrorLabel(this.$v.model.email)">
          <q-input v-model="model.email" float-label="이메일" type="email"/>
        </q-field>

        <q-field icon="fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="this.$v.model.mobilePhoneNumber.$error"
                 :error-label="getErrorLabel(this.$v.model.mobilePhoneNumber)">
          <c-phone-input v-model="model.mobilePhoneNumber" clearable/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 로그인이 불가합니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        권한 정보
        <!--
        <div slot="right" class="no-margin">
          <q-btn flat color="negative" icon="delete">추가</q-btn>
        </div>
        -->
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="column" style="height:100%;min-height:300px;">

        <ag-grid ref="grid" class="ag-theme-material col"
                 row-selection="multiple"
                 enable-col-resize
                 enable-sorting
                 :grid-options="roleGridOptions"
                 :row-data="roleArray"
                 @cell-value-changed="_onRoleCellValueChanged">
          <ag-grid-column field="granted" header-name="승인여부" :width="100" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>
          <ag-grid-column field="role" header-name="코드" :width="200"/>
          <ag-grid-column field="description" header-name="설명" :width="250"/>
        </ag-grid>

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
  import {UserModel, UserRoleArray} from './UserModel';
  import {positive, confirm, warning, getErrorLabel} from 'src/util';
  import {required, minLength, maxLength, email} from 'vuelidate/lib/validators';

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
        model: {
          enabled: true
        },
        creating: false,
        roleArray: new UserRoleArray(),
        roleGridOptions: {},
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
          email: {
            required,
            email,
            minLength: minLength(1),
            maxLength: maxLength(50)
          },
          mobilePhoneNumber: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(50)
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
        this.model = new UserModel({
          enabled: true
        });
        this.fetchRoles();
      },
      show() {
        this.creating = false;
        this.model = new UserModel({
          id: this.id,
          enabled: true
        });
        this.model.id = this.id;
        this.model.fetch().then(() => {
          this.fetchRoles();
        });
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
            this.model.create().then(() => {
              this.saveRoles().then(resolve);
            }).catch(reject);
          } else {
            this.model.update().then(() => {
              this.saveRoles().then(resolve);
            }).catch(reject);
          }
        });
      },
      saveRoles() {
        return Promise.all(this.roleArray.filter((role) => role.hasChanged('granted'))
        .map((role) => {
          role.id = this.model.id;
          return role.granted ? role.grant() : role.revoke();
        }));
      },
      fetchRoles() {
        return this.roleArray.fetch({
          id: this.model.id || ' '
        }).then((array) => {
          array.forEach((item) => item.snapshot());
        });
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {}
  };
</script>
