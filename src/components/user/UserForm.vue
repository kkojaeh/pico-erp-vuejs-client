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
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field icon="email" helper="사용하는 이메일을 입력하세요(로그인에 사용됩니다)"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.email"
                 :error-label="model.$errors.email">
          <q-input v-model="model.email" float-label="이메일" type="email"/>
        </q-field>

        <q-field icon="fa-mobile" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.mobilePhoneNumber" clearable float-label="핸드폰 번호"/>
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
                 :row-data="roleArray">
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
      <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.open()"
             v-show="!creating">이력
        <q-modal ref="auditModal" @open="$refs.auditViewer.load()">
          <audit-viewer ref="auditViewer" url="/audit/user/${id}" :data="model"></audit-viewer>
        </q-modal>
      </q-btn>
      <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
    </q-toolbar>

  </div>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {UserModel, UserRoleArray} from './UserModel';
  import {positive, confirm, warning, getErrorLabel} from 'src/util';
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
        model: new UserModel(),
        creating: false,
        roleArray: new UserRoleArray(),
        roleGridOptions: {},
        enabled: true
      };
    },
    mounted() {
      this.$nextTick(() => this[this.action]());
    },
    methods: {
      async create() {
        this.creating = true;
        await this.fetchRoles();
      },
      async show() {
        this.creating = false;
        this.model.id = this.id;
        await this.model.fetch();
        await this.fetchRoles();
      },
      async _onSaveClick() {
        let valid = this.creating ? await this.model.validateForCreate() : await this.model.validateForUpdate();
        if (valid) {
          let ok = await confirm('저장 하시겠습니까?');
          await this.save();
          positive('저장 되었습니다');
          this.$emit('close');
        } else {
          warning('입력이 유효하지 않습니다');
        }
      },
      async save() {
        if (this.creating) {
          await this.model.create();
          await this.saveRoles();
        } else {
          await this.model.update();
          await this.saveRoles();
        }
      },
      async saveRoles() {
        await Promise.all(this.roleArray
        .filter((role) => role.hasChanged('granted'))
        .map((role) => {
          role.id = this.model.id;
          return role.granted ? role.grant() : role.revoke();
        }));
      },
      async fetchRoles() {
        let array = await this.roleArray.fetch({
          id: this.model.id || ' '
        });
        array.forEach((item) => item.snapshot());
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {AuditViewer}
  };
</script>
