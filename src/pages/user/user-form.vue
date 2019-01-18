<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        사용자 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!phantom"
                   :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field icon="email" helper="사용하는 이메일을 입력하세요(로그인에 사용됩니다)"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.email"
                 :error-label="model.$errors.email">
          <q-input v-model="model.email" float-label="이메일" type="email"/>
        </q-field>

        <q-field icon="account_circle" helper="직위 또는 직급을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.position"
                 :error-label="model.$errors.position">
          <q-input v-model="model.position" float-label="직위/직급"/>
        </q-field>

        <q-field icon="fas fa-sitemap" helper="사용자의 부서를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.departmentId"
                 :error-label="model.$errors.departmentId">
          <c-autocomplete-select float-label="부서" v-model="model.departmentId"
                                 :label="departmentModel.name" :options="departmentLabelArray"
                                 label-field="label" value-field="value"
                                 @search="_onDepartmentSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.mobilePhoneNumber" clearable float-label="핸드폰 번호"/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 로그인이 불가합니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        권한 정보

        <div slot="right" class="row items-center">
          <q-field icon="search"
                   class="col-12">
            <q-input v-model="roleFilter" clearable></q-input>
          </q-field>
        </div>
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="column gutter-md" style="height:100%;min-height:300px;">

        <ag-grid ref="roleGrid" class="col"
                 row-selection="multiple"
                 enable-col-resize
                 enable-sorting
                 :row-data="roleArray">
          <ag-grid-column field="granted" header-name="승인여부" :width="120" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="$authorized.userManager"/>
          <ag-grid-column field="roleId" header-name="코드" :width="200"/>
          <ag-grid-column field="roleName" header-name="이름" :width="200"/>
          <ag-grid-column field="roleDescription" header-name="설명" :width="400"/>
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
               @click="$showAudit(`/audit/user/${model.id}`)"
               v-show="!phantom" label="이력" v-if="$authorized.userManager">
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"
               v-if="$authorized.userManager"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {DepartmentLabelArray, DepartmentModel, UserModel, UserRoleArray} from 'src/model/user'

  export default {
    authorized: {
      'userManager': 'hasRole(\'USER_MANAGER\')'
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
        model: new UserModel(),
        departmentLabelArray: new DepartmentLabelArray(),
        departmentModel: new DepartmentModel(),
        roleArray: new UserRoleArray(),
        roleFilter: null
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.departmentLabelArray.fetch()
    },
    methods: {
      async create() {
        this.model = new UserModel()
        const roleArray = new UserRoleArray(this.model)
        await roleArray.fetch()
        this.roleArray = roleArray
      },
      async load(id) {
        this.model = await UserModel.get(id)
        const roleArray = new UserRoleArray(this.model)
        await roleArray.fetch()
        this.roleArray = roleArray
      },
      async show() {
        await this.load(this.id)
      },
      async _onDepartmentSearch(keyword) {
        await this.departmentLabelArray.fetch(keyword)
      },
      async onSaveClick() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable && this.closeConfirmed) {
              this.$closeOverlay()
            } else {
              await this.load(this.model.id)
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
        await this.roleArray.save()
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      roleFilter() {
        const grid = this.$refs.roleGrid
        grid.api.setQuickFilter(this.roleFilter)
      },
      'model.departmentId': async function (to) {
        this.departmentModel = await DepartmentModel.get(to, true)
      },
    }
  }
</script>
