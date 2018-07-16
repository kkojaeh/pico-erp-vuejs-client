<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        품목 정보
      </q-card-title>

      <q-card-main class="row gutter-md">

        <q-field icon="shopping_cart" helper="공정의 대상 품목입니다"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-input v-model="itemModel.code" float-label="품목 코드" readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="itemModel.code" v-clipboard-notify
                   flat></q-btn>
          </q-input>

        </q-field>

        <q-field icon="shopping_cart" helper="공정의 대상 품목입니다"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-input v-model="itemModel.name" float-label="품목 이름" readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="itemModel.name" v-clipboard-notify
                   flat></q-btn>
          </q-input>
        </q-field>

      </q-card-main>

    </q-card>


    <q-card class="col-12" flat>

      <q-card-title>
        공정 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="공정 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active" readonly
                   hide-underline/>
        </q-field>

        <q-field icon="account_box" helper="공정 유형을 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.typeId"
                 :error-label="model.$errors.typeId">
          <c-autocomplete-select float-label="공정 유형" v-model="model.typeId"
                                 :label="typeModel.name" :options="processTypeLabels"
                                 label-field="label" value-field="value"
                                 @search="onProcessTypeSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fa-comment" helper="공정 난이도를 지정하세요"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-select float-label="난이도" v-model="model.difficulty"
                    :options="difficultyLabels"></q-select>
        </q-field>

        <q-field icon="account_box" helper="공정의 관리자를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">
          <c-autocomplete-select float-label="관리자" v-model="model.managerId"
                                 :label="managerModel.name" :options="userLabels"
                                 label-field="label" value-field="value"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fa-comment" helper="공정 설명을 입력하세요"
                 class="col-xs-12 col-md-12 col-xl-12">
          <c-html-editor v-model="model.description" :readonly="!isModifiable"></c-html-editor>
        </q-field>

        <q-field icon="attachment" helper="공정 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-12 col-xl-12">

          <c-attachment ref="attachment" v-model="model.attachmentId" category="process"
                        multiple :readonly="!isModifiable"></c-attachment>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card v-if="model.commentSubjectId" class="col-12" flat>

      <q-card-title>
        댓글
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <comment-list class="col-xs-12 col-md-11 col-xl-11 no-border" :readonly="!isCommentable"
                      subject-type="process" :subject="model.commentSubjectId"></comment-list>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn v-if="isModifiable" flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    ProcessDifficultyArray,
    ProcessModel,
    ProcessTypeLabelArray,
    ProcessTypeModel
  } from 'src/model/process'
  import { ItemModel } from 'src/model/item'
  import { UserLabelArray, UserModel } from 'src/model/user'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import CommentList from 'src/pages/comment/comment-list.vue'

  export default {
    authorized: {
      'processManager': 'hasRole(\'PROCESS_MANAGER\')'
    },
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      itemId: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: new ProcessModel(),
        itemModel: new ItemModel(),
        typeModel: new ProcessTypeModel(),
        managerModel: new UserModel(),
        processTypeLabels: new ProcessTypeLabelArray(),
        difficultyLabels: new ProcessDifficultyArray(),
        userLabels: new UserLabelArray()
      }
    },
    mounted () {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.processTypeLabels.query()
      this.difficultyLabels.fetch()
      this.userLabels.query()
    },
    methods: {
      async onProcessTypeSearch (keyword, done) {
        await this.processTypeLabels.query(keyword)
        done()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async create () {
        this.itemModel = await ItemModel.get(this.itemId)
        this.model = new ProcessModel()
        this.model.itemId = this.itemModel.id
        this.typeModel = new ProcessTypeModel()
      },
      async show () {
        this.model = await ProcessModel.get(this.id)
        this.itemModel = await ItemModel.get(this.model.itemId)
        this.typeModel = await ProcessTypeModel.get(this.model.typeId)
        this.managerModel = await UserModel.get(this.model.managerId)
      },
      async onSaveClick () {
        let valid = await this.model.validate()
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
        await this.model.save()
        this.$emit('saved', this.model)
      },

      rename () {
        const typeName = this.typeModel.name || 'N/A'
        const itemName = this.itemModel.name
        this.model.name = `[${typeName}] ${itemName}`
      }
    },
    computed: {
      isModifiable () {
        return this.$authorized.processManager && !this.model.deleted
      },
      isCommentable () {
        return !this.model.deleted
      },
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'model.typeId': async function (to) {
        this.typeModel = await ProcessTypeModel.get(to, true)
      },
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'itemModel' () {
        this.rename()
      },
      'typeModel' () {
        this.rename()
      }

    },
    components: {
      AuditViewer,
      CommentList
    }
  }
</script>
