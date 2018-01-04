<template>

  <div class="row" style="min-width: 70vw;">

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="perm_identity" helper="아이디를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-tabs class="col-xs-12 col-xl-6 no-margin" inverted>
      <!-- Tabs - notice slot="title" -->
      <q-tab default :disable="creating" slot="title" name="tab-1" icon="fa-users">권한 정보</q-tab>
      <q-tab :disable="creating" slot="title" name="tab-2" icon="fingerprint">사용자</q-tab>
      <!-- Targets -->
      <q-tab-pane :disabled="creating" name="tab-1" class="column"
                  style="height:100%;min-height:500px;">
        <ag-grid ref="roleGrid" class="ag-theme-material col"
                 row-selection="multiple"
                 enable-col-resize
                 enable-sorting
                 @cell-value-changed="_onRoleGridCellValueChanged"
                 :grid-options="roleGridOptions"
                 :row-data="roleArray">
          <ag-grid-column field="granted" header-name="승인여부" :width="100" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>
          <ag-grid-column field="roleId" header-name="코드" :width="200"/>
          <ag-grid-column field="roleDescription" header-name="설명" :width="250"/>
        </ag-grid>
      </q-tab-pane>
      <q-tab-pane :disabled="creating" name="tab-2" class="column"
                  style="height:100%;min-height:500px;">
        <q-input v-model="groupUser.userId" placeholder="추가할 사용자의 이름을 입력하고 선택하세요">
          <q-autocomplete
              @search="_onUserSearch"
              :min-characters="1"
              @selected="_onUserSelect"
          />
        </q-input>
        <ag-grid ref="userGrid" class="ag-theme-material col"
                 row-selection="multiple"
                 enable-col-resize
                 enable-sorting
                 :grid-options="userGridOptions"
                 :row-data="userArray">

          <ag-grid-column field="granted" header-name="삭제" :width="100" suppress-sorting
                          cell-renderer-framework="ag-grid-icon-renderer"
                          :cell-renderer-params="{handler:_onUserRemove, icon:'fa-ban', link:true}"/>
          <ag-grid-column field="userId" header-name="아이디" :width="200"/>
          <ag-grid-column field="userName" header-name="이름" :width="250"/>
        </ag-grid>
      </q-tab-pane>
    </q-tabs>


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
  import {GroupModel, GroupRoleArray, GroupUserArray, GroupUserModel} from './GroupModel';
  import {UserLabelArray} from '../user/UserModel';
  import {positive, confirm, warning} from 'src/util';
  import AuditViewer from '@/audit/AuditViewer.vue';

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
        creating: false,
        roleArray: new GroupRoleArray(),
        roleGridOptions: {},
        userArray: new GroupUserArray(),
        userGridOptions: {},
        userLabelArray: new UserLabelArray(),
        groupUser: new GroupUserModel()
      };
    },
    mounted() {
      this.$nextTick(() => this[this.action]());
    },
    methods: {
      async create() {
        this.creating = true;
        await Promise.all([this.fetchRoles(), this.fetchUsers()]);
      },
      async show() {
        this.creating = false;
        this.model.id = this.id;
        await this.model.fetch();
        await Promise.all([this.fetchRoles(), this.fetchUsers()]);
      },
      async _onSaveClick() {
        let valid = this.creating ? await this.model.validateForCreate()
            : await this.model.validateForUpdate();
        if (valid) {
          let ok = await confirm('저장 하시겠습니까?');
          await this.save();
          positive('저장 되었습니다');
          this.id = this.model.id;
          this.show();
        } else {
          warning('입력이 유효하지 않습니다');
        }
      },
      async save() {
        if (this.creating) {
          await this.model.create();
        } else {
          await this.model.update();
        }
      },
      async fetchUsers() {
        return await this.userArray.fetch({
          id: this.model.id || ' '
        });
      },
      async fetchRoles() {
        return await this.roleArray.fetch({
          id: this.model.id || ' '
        });
      },
      async _onUserSearch(keyword, done) {
        await this.userLabelArray.query(keyword);
        done(this.userLabelArray);
      },
      async _onUserSelect(item) {
        this.groupUser.groupId = this.model.id;
        await this.groupUser.add();
        await this.fetchUsers();
      },
      async _onUserRemove(item) {
        let ok = await confirm('해당 사용자를 삭제 하시겠습니까?');
        if (ok) {
          await item.remove();
          await this.fetchUsers();
        }
      },
      _onRoleGridCellValueChanged(e) {
        if(e.column.colId === 'granted'){
          e.value ? e.data.grant() : e.data.revoke();
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {AuditViewer}
  };
</script>