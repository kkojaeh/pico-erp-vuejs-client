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

        <q-field icon="category" helper="알림 주제 유형 입니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-select float-label="주제 유형" v-model="model.subjectTypeId"
                    :options="subjectTypeArray" readonly hide-underline></q-select>
        </q-field>

        <q-field icon="send" helper="알림 송신 수단 입니다"
                 class="col-xs-11 col-md-4 col-xl-3">
          <q-select float-label="송신 수단" v-model="model.senders"
                    :options="senderArray" multiple></q-select>
        </q-field>

        <q-field icon="done" helper="사용 여부를 체크하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.enabled"
                 :error-label="model.$errors.enabled">
          <q-checkbox label="사용 여부" v-model="model.enabled"/>
        </q-field>

        <q-field icon="reply_all" helper="복수 송신 여부를 체크하세요(가능한 모든 수단으로 송신)"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.enabled"
                 :error-label="model.$errors.enabled">
          <q-checkbox label="복수 송신" v-model="model.multipleSend"/>
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
        <q-field icon="description" helper="markdown 형식"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                 :error="!!model.$errors.markdownTemplate"
                 :error-label="model.$errors.markdownTemplate">
          <q-input type="textarea" v-model="model.markdownTemplate" float-label="markdown 템플릿"
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
  import {NotifySenderArray, NotifySubjectTypeArray, NotifyTypeModel} from 'src/model/notify'

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
        model: new NotifyTypeModel(),
        senderArray: [],
        subjectTypeArray: []
      }
    },
    async mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      const senderArray = new NotifySenderArray()
      await senderArray.fetch()
      senderArray.forEach(e => {
        e.value = e.id
        e.label = e.name
      })
      this.senderArray = senderArray
      const subjectTypeArray = new NotifySubjectTypeArray()
      await subjectTypeArray.fetch()
      subjectTypeArray.forEach(e => {
        e.value = e.id
        e.label = e.name
      })
      this.subjectTypeArray = subjectTypeArray
    },
    methods: {
      async load(id) {
        this.model = await NotifyTypeModel.get(id)
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
    components: {}
  }
</script>
