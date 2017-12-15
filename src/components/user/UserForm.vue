<template>

  <div class="row">

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main>

        <q-field icon="perm_identity" helper="아이디를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-input v-model="model.id" float-label="아이디" clearable :readonly="!creating"
                   @keyup.enter="retrieve()"/>
        </q-field>

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-input v-model="model.name" float-label="이름" clearable
                   @keyup.enter="retrieve()"/>
        </q-field>

        <q-field icon="email" helper="사용하는 이메일을 입력하세요(로그인에 사용됩니다)"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-input v-model="model.email" float-label="이메일" type="email" clearable
                   @keyup.enter="retrieve()"/>
        </q-field>

        <q-field icon="phone" helper="핸드폰 번호를 입력하세요"
                 class="col-xs-11 col-md-4 col-xl-3">
          <c-phone-input v-model="model.phoneNumber" clearable></c-phone-input>
        </q-field>

        <q-field icon="check_circle" helper="활성화 상태를 선택하세요 비활성시 로그인이 불가합니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-toggle label="활성화 여부" clearable v-model="model.enabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-xl-6 no-margin" flat>

      <q-card-title>
        권한 정보
        <div slot="right" class="no-margin">
          <q-btn flat color="negative" icon="delete">추가</q-btn>
        </div>
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
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
      <q-btn flat icon="save" @click="save()">저장</q-btn>
    </q-toolbar>

  </div>

</template>
<script>
  import {mapGetters} from 'vuex';
  import {UserRoleArray} from './UserModel';
  import {confirm} from 'src/util';

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
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
    validations: {},
    mounted() {
      this.$nextTick(() => this[this.action]());
    },
    methods: {
      create() {
        this.creating = true;
        this.model = {
          enabled: true
        };
        this.fetchRoles();
      },
      retrieve() {
      },
      save() {
        confirm('저장 하시겠습니까?').then((ok) => {
          if (ok) {
            this.roleArray.forEach((role) => console.log(role, role.hasChanged()));
          }
        });
      },
      fetchRoles() {
        return this.roleArray.fetch({
          id: this.model.id || ' '
        });
      },
      _onRoleCellValueChanged(e) {
      }
    },
    computed: {
      ...mapGetters([])
    },
    components: {}
  };
</script>
