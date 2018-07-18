<template>
  <q-page class="row items-baseline layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        품목 분류 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="chevron_right"
                 class="col-xs-12 col-md-6 col-xl-6">
          <q-input :value="path" float-label="경로" readonly hide-underline/>
        </q-field>

        <q-field icon="perm_identity"
                 class="col-xs-12 col-md-6 col-xl-6">
          <q-input :value="model.code" float-label="코드" readonly hide-underline/>
        </q-field>

        <q-field icon="account_circle" helper="품목 분류 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="description" helper="품목 분류의 설명을 입력하세요"
                 class="col-xs-12 col-md-8 col-lg-8 col-xl-8"
                 :error="!!model.$errors.description"
                 :error-label="model.$errors.description"
                 :count="200">
          <q-input type="textarea" v-model="model.description" float-label="설명"
                   rows="5"
                   max-length="200"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom">삭제</q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!phantom">이력
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer"
                          :url="`/audit/item-category/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {ItemCategoryModel} from 'src/model/item'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'

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
    data() {
      return {
        model: new ItemCategoryModel(),
        parentModel: new ItemCategoryModel(),
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async create() {
        this.model = new ItemCategoryModel()
        if (this.parentId) {
          this.parentModel = await ItemCategoryModel.get(this.parentId)
          this.model.parentId = this.parentId
        }
      },
      async show() {
        this.model = await ItemCategoryModel.get(this.id)
      },
      async onSaveClick() {
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
      async save() {
        await this.model.save()
      }
    },
    computed: {
      path() {
        if (this.model.path) {
          return this.model.path
        }
        if (this.parentModel.path) {
          return this.parentModel.path + ' > ' + (this.model.name || '')
        } else {
          return this.model.name
        }
      },
      phantom() {
        return this.model.phantom
      }
    },
    components: {
      AuditViewer
    }
  }
</script>
