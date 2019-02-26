<template>
  <q-page class="row items-baseline layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        알림 유형 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        템플릿
        <span slot="subtitle">mustache 문법을 사용합니다</span>
        <span slot="right">
          <q-input v-model="testKey" float-label="테스트 키"/>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">
        <q-field icon="description" helper="markdown 형식"
                 class="col-12"
                 :error="!!model.$errors.template"
                 :error-label="model.$errors.template">
          <q-input type="textarea" v-model="model.template" float-label="pdfmake 템플릿"
                   rows="20"/>
        </q-field>

      </q-card-main>

    </q-card>


    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="save" @click="onTest()">테스트</q-btn>
        <q-btn flat icon="save" @click="onSave()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {DocumentSubjectModel} from 'src/model/document'
  import download from 'js-file-download'

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
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new DocumentSubjectModel(),
        testCompileSynchronized: false,
        testKey: null,
        markdownTemplateResult: null
      }
    },
    async mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async load(id) {
        this.model = await DocumentSubjectModel.get(id)
        this.testKey = localStorage.getItem('document-subject-test-key-' + id) || ''
      },
      async show() {
        await this.load(this.id)
      },
      async onSave() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
      },
      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },

      async onTest() {
        if (!this.testKey) {
          this.$alert.warning('테스트 키가 없습니다')
          return
        }
        localStorage.setItem('document-subject-test-key-' + this.model.id, this.testKey)
        const blob = await this.model.test(this.testKey)
        download(blob, 'test.pdf')
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    watch: {},
    components: {}
  }
</script>
