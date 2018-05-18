<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        프로젝트 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="프로젝트 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-8"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field ref="registrationNumber" icon="account_box" helper="담당자를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">
          <c-autocomplete-select float-label="담당자" v-model="model.managerId"
                                 :label="managerModel.name" :options="userLabels"
                                 label-field="label" value-field="value"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fa-comment" helper="프로젝트 설명을 입력하세요"
                 class="col-xs-12 col-md-12 col-xl-12">
          <c-html-editor v-model="model.description"></c-html-editor>
        </q-field>

        <q-field icon="attachment" helper="프로젝트 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-12 col-xl-12">
          <c-attachment ref="attachment" v-model="model.attachmentId" category="project"
                        multiple ></c-attachment>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        고객 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fa-building" helper="고객사를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabels"
                                 label-field="label" value-field="value"
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="고객 담당자 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerManagerContact.name"
                 :error-label="model.$errors.customerManagerContact.name">
          <q-input v-model="model.customerManagerContact.name" float-label="고객 담당자 이름"
                   class="ime-mode-active"/>
        </q-field>

        <q-field icon="email" helper="고객 담당자 이메일을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerManagerContact.email"
                 :error-label="model.$errors.customerManagerContact.email">
          <q-input v-model="model.customerManagerContact.email" type="email"
                   float-label="고객 담당자 이메일"
                   class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fa-mobile" helper="고객 담당자 핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.mobilePhoneNumber"
                                float-label="고객 담당자 핸드폰 번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="phone" helper="고객 담당자 전화 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.telephoneNumber"
                 :error-label="model.$errors.telephoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.telephoneNumber"
                                float-label="고객 담당자 전화번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fa-fax" helper="고객 담당자 FAX 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.faxNumber"
                 :error-label="model.$errors.faxNumber">
          <c-phone-number-input v-model="model.customerManagerContact.faxNumber"
                                float-label="고객 담당자 FAX 번호"
                                class="ime-mode-disabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card v-if="model.commentSubjectId" class="col-12" flat>

      <q-card-title>
        댓글
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <comment-list class="col-xs-12 col-md-11 col-xl-11 no-border"
                      subjectType="project" :subject="model.commentSubjectId"></comment-list>

      </q-card-main>

    </q-card>


    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating" label="삭제"></q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating" label="이력">
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" :url="`/audit/project/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="_onSaveClick()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import { mapGetters } from 'vuex'
  import { ProjectModel } from 'src/model/project'
  import { CompanyLabelArray, CompanyModel } from 'src/model/company'
  import { UserLabelArray, UserModel } from 'src/model/user'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import CommentList from 'src/pages/comment/comment-list.vue'

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
        model: new ProjectModel(),
        companyLabels: new CompanyLabelArray(),
        userLabels: new UserLabelArray(),
        managerModel: new UserModel(),
        customerModel: new CompanyModel(),
        creating: false,
        enabled: true
      }
    },
    mounted () {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.companyLabels.query()
      this.userLabels.query()
    },
    methods: {
      async onCustomerSearch (keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async create () {
        this.creating = true
        this.model = new ProjectModel()
      },
      async show () {
        this.creating = false
        this.model = await ProjectModel.get(this.id)
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateCreate()
          : await this.model.validateUpdate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              this.$closeOverlay()
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save () {
        const attachment = this.$refs.attachment
        await attachment.save()
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    watch: {
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.customerModel = await CompanyModel.get(to, true)
      }
    },
    components: {
      AuditViewer,
      CommentList
    }
  }
</script>
