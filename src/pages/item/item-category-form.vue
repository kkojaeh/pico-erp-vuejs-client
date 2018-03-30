<template>
  <!-- style="min-width: 70vw; max-width:95vw" -->
  <q-layout class="row items-baseline layout-padding" view="hHh Lpr fFf">

    <q-card class="col-12" flat>

      <q-card-title>
        기본 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="chevron_right"
                 class="col-xs-12 col-md-6 col-xl-6">
          <q-input :value="path" float-label="경로" readonly hide-underline/>
        </q-field>

        <q-field icon="perm_identity"
                 class="col-xs-12 col-md-6 col-xl-6" dark>
          <q-input :value="model.code" float-label="코드" readonly hide-underline/>
        </q-field>

        <q-field icon="account_circle" helper="품목 분류 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="fa-clipboard-list" helper="품목 분류의 설명을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-6"
                 :error="!!model.$errors.description"
                 :error-label="model.$errors.description"
                 :count="200">
          <q-input type="textarea" v-model="model.description" float-label="설명"
                   rows="5"
                   max-length="200"/>
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
            <audit-viewer ref="auditViewer" url="/audit/item-category/${id}"
                          :data="model"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-layout-footer>


  </q-layout>

</template>
<script>
  import { ItemCategoryModel } from './item-category-model'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import { language, languageAliases } from 'src/i18n'

  export default {
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      parentId: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: new ItemCategoryModel(),
        parentModel: new ItemCategoryModel(),
        creating: false
      }
    },
    mounted () {
      this.$nextTick(() => this[this.action]())
    },
    methods: {
      async create () {
        this.creating = true
        if (this.parentId) {
          this.parentModel.id = this.parentId
          this.model.parentId = this.parentId
          await this.parentModel.fetch()
        }
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
    computed: {
      parentPath () {
        return this.parentModel.path ? this.parentModel.path : languageAliases({
          ko: '없음(N/A)'
        })[language]
      },
      path () {
        if (this.model.path) {
          return this.model.path
        }
        if (this.parentModel.path) {
          return this.parentModel.path + ' > ' + (this.model.name || '')
        } else {
          return this.model.name
        }
      }
    },
    components: {
      AuditViewer
    }
  }
</script>
