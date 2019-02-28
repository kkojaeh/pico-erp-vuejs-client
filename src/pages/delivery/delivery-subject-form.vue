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
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">
        <q-field icon="description" helper="markdown 템플릿"
                 class="col-12"
                 :error="!!model.$errors.titleTemplate"
                 :error-label="model.$errors.titleTemplate">
          <q-input v-model="model.titleTemplate" float-label="제목"
                   rows="10"/>
        </q-field>
        <q-field icon="description" helper="markdown 템플릿"
                 class="col-12"
                 :error="!!model.$errors.bodyTemplate"
                 :error-label="model.$errors.bodyTemplate">
          <q-input type="textarea" v-model="model.bodyTemplate" float-label="본문"
                   rows="10"/>
        </q-field>
      </q-card-main>

    </q-card>


    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {DeliverySubjectModel} from 'src/model/delivery'

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
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new DeliverySubjectModel()
      }
    },
    async mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      async load(id) {
        this.model = await DeliverySubjectModel.get(id)
      },
      async show() {
        await this.load(this.id)
      },
      async onSaveClick() {
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
