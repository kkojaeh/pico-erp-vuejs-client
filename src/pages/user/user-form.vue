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
          <q-input v-model="model.name" float-label="이름" :readonly="!updatable"
                   :hide-underline="!updatable"/>
        </q-field>

        <q-field icon="email" helper="사용하는 이메일을 입력하세요(로그인에 사용됩니다)"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.email"
                 :error-label="model.$errors.email">
          <q-input v-model="model.email" float-label="이메일" type="email" :readonly="!updatable"
                   :hide-underline="!updatable"/>
        </q-field>

        <q-field icon="account_circle" helper="직위 또는 직급을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.position"
                 :error-label="model.$errors.position">
          <q-input v-model="model.position" float-label="직위/직급" :readonly="!updatable"
                   :hide-underline="!updatable"/>
        </q-field>

        <q-field icon="fas fa-sitemap" helper="사용자의 부서를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.departmentId"
                 :error-label="model.$errors.departmentId">
          <c-autocomplete-select float-label="부서" v-model="model.departmentId"
                                 :label="labels.department.name" :options="labels.departments"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable"
                                 :hide-underline="!updatable"
                                 @search="_onDepartmentSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.mobilePhoneNumber" clearable float-label="핸드폰 번호"
                                :readonly="!updatable"
                                :hide-underline="!updatable"/>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 로그인이 불가합니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-toggle label="활성화 여부" v-model="model.enabled" :readonly="!updatable"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-tabs class="col-12" inverted>
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" icon="group">그룹</q-tab>
      <q-tab slot="title" name="tab-2" icon="account_box">권한</q-tab>
      <!-- Targets -->
      <q-tab-pane name="tab-1" class="row">
        <ag-grid ref="roleGrid" class="col"
                 row-selection="single"
                 :grid-auto-height="true"
                 enable-col-resize
                 enable-sorting
                 :row-data="groups">
          <ag-grid-column field="included" header-name="포함여부" :width="120" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="updatable"/>
          <ag-grid-column field="groupId" header-name="코드" :width="200"/>
          <ag-grid-column field="groupName" header-name="이름" :width="200"/>
        </ag-grid>
      </q-tab-pane>

      <q-tab-pane name="tab-2" class="row">
        <ag-grid ref="roleGrid" class="col"
                 row-selection="single"
                 :grid-auto-height="true"
                 enable-col-resize
                 enable-sorting
                 :row-data="roles">
          <ag-grid-column field="granted" header-name="승인여부" :width="120" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="updatable"/>
          <ag-grid-column field="roleId" header-name="코드" :width="200"/>
          <ag-grid-column field="roleName" header-name="이름" :width="200"/>
          <ag-grid-column field="roleDescription" header-name="설명" :width="400"/>
        </ag-grid>
      </q-tab-pane>
    </q-tabs>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"
               v-if="updatable"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {QSelect} from 'quasar'
  import {
    DepartmentLabelArray,
    DepartmentModel,
    UserGroupArray,
    UserModel,
    UserRoleArray
  } from 'src/model/user'

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
        labels: {
          department: new DepartmentModel(),
          departments: new DepartmentLabelArray()
        },
        roles: new UserRoleArray(),
        roleFilter: null,
        groups: new UserGroupArray()
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.labels.departments.fetch()
    },
    methods: {
      $autocomplete(expression) {
        return function (terms, done) {

        }
      },
      async departmentFilter(keyword, done) {
        await this.labels.departments.fetch(keyword)
      },
      async create() {
        this.model = new UserModel()
        const roles = new UserRoleArray(this.model)
        await roles.fetch()
        const groups = new UserGroupArray(this.model)
        await groups.fetch()
        this.roles = roles
        this.groups = groups
      },
      async load(id) {
        this.model = await UserModel.get(id)
        const roles = new UserRoleArray(this.model)
        await roles.fetch()
        const groups = new UserGroupArray(this.model)
        await groups.fetch()
        this.roles = roles
        this.groups = groups
      },
      async show() {
        await this.load(this.id)
      },
      async _onDepartmentSearch(keyword) {
        await this.labels.departments.fetch(keyword)
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
        await this.roles.save()
        await this.groups.save()
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      },
      updatable() {
        return this.$authorized.userManager
      }
    },
    watch: {
      roleFilter() {
        const grid = this.$refs.roleGrid
        grid.api.setQuickFilter(this.roleFilter)
      },
      'model.departmentId': async function (to) {
        this.labels.department = await DepartmentModel.get(to, true)
      },
    }
  }
</script>
