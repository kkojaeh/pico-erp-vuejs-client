<template>
  <!-- style="min-width: 70vw; max-width:95vw" -->
  <q-layout class="row items-baseline layout-padding" view="hHh Lpr fFf">

    <q-card class="col-12" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="부서를 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!creating" :hide-underline="!creating"/>
        </q-field>

        <q-field icon="account_circle" helper="부서 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="fa-user" helper="부서의 관리자를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">
          <c-autocomplete-select float-label="관리자" v-model="model.managerId"
                                 :label.sync="model.managerName" :options="userLabels"
                                 label-field="label" value-field="value"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-layout-footer>
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="$emit('close')" v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating">이력
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" url="/audit/department/${id}"
                          :data="model"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-layout-footer>


  </q-layout>

</template>
<script>
  import { DepartmentModel } from './department-model'
  import { UserLabelArray } from 'src/pages/user/user-model'
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
    data () {
      return {
        model: new DepartmentModel(),
        userLabels: new UserLabelArray(),
        creating: false
      }
    },
    mounted () {
      this.$nextTick(() => this[this.action]())
    },
    methods: {
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async create () {
        this.creating = true
      },
      async show () {
        this.creating = false
        this.model.id = this.id
        await this.model.fetch()
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateForCreate()
          : await this.model.validateForUpdate()
        if (valid) {
          await this.save()
          this.$alert.positive('저장 되었습니다')
          this.$emit('close')
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save () {
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
      }
    },
    computed: {},
    components: {
      AuditViewer
    }
  }
</script>
