<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        그룹 정보
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

      </q-card-main>

    </q-card>

    <q-tabs class="col-12" inverted>
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" icon="account_boxs">권한</q-tab>
      <q-tab slot="title" name="tab-2" icon="fingerprint">사용자</q-tab>
      <!-- Targets -->
      <q-tab-pane name="tab-1" class="row">
        <ag-grid ref="roleGrid" class="col"
                 row-selection="single"
                 :grid-auto-height="true"
                 enable-col-resize
                 enable-sorting
                 :row-data="roleArray">
          <ag-grid-column field="granted" header-name="승인여부" :width="120" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>
          <ag-grid-column field="roleId" header-name="코드" :width="200"/>
          <ag-grid-column field="roleName" header-name="코드" :width="200"/>
          <ag-grid-column field="roleDescription" header-name="설명" :width="400"/>
        </ag-grid>
      </q-tab-pane>
      <q-tab-pane name="tab-2" class="column">
        <q-field icon="search" helper="추가할 사용자의 이름을 입력하고 선택하세요" class="col-auto">
          <c-autocomplete-select ref="groupUser" float-label="담당자" v-model="groupUserId"
                                 :options="userLabels"
                                 label-field="label" value-field="value"
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>
        <ag-grid ref="userGrid" class="col-auto"
                 row-selection="single"
                 :grid-auto-height="true"
                 enable-col-resize
                 enable-sorting
                 :row-data="userArray">

          <ag-grid-column field="deleted" header-name="삭제" :width="100" suppress-sorting
                          cell-renderer-framework="ag-grid-icon-renderer"
                          :cell-renderer-params="{handler:onUserRemove, icon:'fa-ban', link:true}"/>
          <ag-grid-column field="userId" header-name="아이디" :width="200"/>
          <ag-grid-column field="userName" header-name="이름" :width="250"/>
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
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!phantom" label="이력">
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" :url="`/audit/group/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {
    GroupModel,
    GroupRoleArray,
    GroupUserArray,
    GroupUserModel,
    UserLabelArray,
    UserModel
  } from 'src/model/user'
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
    data() {
      return {
        model: new GroupModel(),
        roleArray: new GroupRoleArray(),
        userArray: new GroupUserArray(),
        userLabels: new UserLabelArray(),
        groupUserId: null
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async create() {
        this.model = new GroupModel()
        this.roleArray = new GroupRoleArray(this.model)
        this.userArray = new GroupUserArray(this.model)
        await this.roleArray.query()
        await this.userArray.query()
      },
      async show() {
        this.model = await GroupModel.get(this.id)
        this.roleArray = new GroupRoleArray(this.model)
        this.userArray = new GroupUserArray(this.model)
        await this.roleArray.query()
        await this.userArray.query()
      },
      async onSaveClick() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
        await this.roleArray.save()
        await this.userArray.save()
      },
      async onUserSearch(keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async onUserRemove(user) {
        const ok = await this.$alert.confirm('해당 사용자를 삭제 하시겠습니까?')
        if (ok) {
          this.userArray.remove(user)
        }
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'groupUserId': async function (to) {
        if (to) {
          const user = await UserModel.get(to, true)
          const groupUser = new GroupUserModel()
          groupUser.userId = user.id
          groupUser.userName = user.name
          this.userArray.push(groupUser)
          this.groupUserId = null
          this.$refs.groupUser.focus()
        }
      }
    },
    components: {AuditViewer}
  }
</script>