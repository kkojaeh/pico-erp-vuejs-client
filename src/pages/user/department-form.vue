<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        부서 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="부서를 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!phantom"
                   :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle" helper="부서 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"
                   :readonly="!updatable"
                   :hide-underline="!updatable"/>
        </q-field>

        <q-field icon="account_box" helper="부서의 관리자를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">
          <c-autocomplete-select float-label="관리자" v-model="model.managerId"
                                 :label="managerModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable"
                                 :hide-underline="!updatable"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

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
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"
               v-if="updatable"></q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {DepartmentModel, UserLabelArray, UserModel} from 'src/model/user'

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
        model: new DepartmentModel(),
        userLabelArray: new UserLabelArray(),
        managerModel: new UserModel()
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.userLabelArray.fetch()
    },
    methods: {
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async create() {
        this.model = new DepartmentModel()
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        this.model = await DepartmentModel.get(id)
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
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      }
    },
    components: {}
  }
</script>
