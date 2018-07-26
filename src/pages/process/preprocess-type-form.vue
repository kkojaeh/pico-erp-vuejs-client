<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        사전 공정 유형 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="사전 공정 유형을 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!phantom"
                   :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle" helper="사전 공정 유형의 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="account_box" helper="사전 공정 유형의 분류를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.infoTypeId"
                 :error-label="model.$errors.infoTypeId">
          <c-autocomplete-select float-label="분류" v-model="model.infoTypeId"
                                 :label="infoTypeModel.name" :options="infoTypeLabels"
                                 label-field="label" value-field="value"
                                 @search="onProcessInfoTypeSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="attach_money" helper="사전 공정유형의 기준 단가 입니다"
                 :error="!!model.$errors.baseCost"
                 :error-label="model.$errors.baseCost"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input type="number" v-model="model.baseCost" float-label="기준 단가" align="right"/>
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
                          :url="`/audit/preprocess-type/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    PreprocessTypeModel,
    ProcessInfoTypeLabelArray,
    ProcessInfoTypeModel
  } from 'src/model/process'
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
    data() {
      return {
        model: new PreprocessTypeModel(),
        infoTypeLabels: new ProcessInfoTypeLabelArray(),
        infoTypeModel: new ProcessInfoTypeModel()
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.infoTypeLabels.query()
    },
    methods: {
      difficultyLabel(value) {
        const label = this.difficultyLabels.find(data => data.value == value)
        return label ? label.label : ''
      },
      async onProcessInfoTypeSearch(keyword, done) {
        await this.infoTypeLabels.query(keyword)
        done()
      },
      async create() {
        this.model = new PreprocessTypeModel()
      },
      async show() {
        this.model = await PreprocessTypeModel.get(this.id)
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
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'model.infoTypeId': async function (to) {
        this.infoTypeModel = await ProcessInfoTypeModel.get(to, true)
      }
    },
    components: {
      AuditViewer
    }
  }
</script>
