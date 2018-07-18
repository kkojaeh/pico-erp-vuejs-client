<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        공정 유형 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="perm_identity" helper="공정 유형을 식별하는 아이디를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.id" :error-label="model.$errors.id">
          <q-input v-model="model.id" float-label="아이디" :readonly="!phantom"
                   :hide-underline="!phantom"/>
        </q-field>

        <q-field icon="account_circle" helper="공정 유형의 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="account_box" helper="공정 유형의 분류를 선택하세요"
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

        <q-field icon="attach_money" helper="공정유형의 기준 단가 입니다"
                 :error="!!model.$errors.baseUnitCost"
                 :error-label="model.$errors.baseUnitCost"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input type="number" v-model="model.baseUnitCost" float-label="기준 단가" align="right"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-md-6 col-xl-6" flat>

      <q-card-title>
        공정 단가 구성 비율
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="pie_chart" helper="공정의 단가 비율을 입력하세요"
                 class="col-12"
                 :error="!!model.$errors.costRates"
                 :error-label="model.$errors.costRates">
          <q-list highlight separator>
            <q-list-header class="row justify-end">
              <div style="padding-right: 10px;">{{Math.round(totalCostRate * 100)}}% / 100%</div>

            </q-list-header>
            <q-item-separator/>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  직접 노무비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.directLabor"
                    label-always
                    :label-value="Math.round(model.costRates.directLabor * 100) + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item-separator/>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 노무비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectLabor"
                    label-always
                    :label-value="Math.round(model.costRates.indirectLabor * 100) + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item-separator/>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 재료비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectMaterial"
                    label-always
                    :label-value="Math.round(model.costRates.indirectMaterial * 100) + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
            <q-item-separator/>
            <q-item>
              <q-item-main>
                <q-item-tile stamp>
                  간접 경비 비율
                </q-item-tile>
                <q-slider
                    v-model="model.costRates.indirectExpenses"
                    label-always
                    :label-value="Math.round(model.costRates.indirectExpenses * 100) + '%'"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    snap
                />
              </q-item-main>
            </q-item>
          </q-list>
        </q-field>
      </q-card-main>
    </q-card>

    <q-card class="col-xs-12 col-md-6 col-xl-6" flat>

      <q-card-title>
        난이도별 단가 반영률
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">
        <q-field icon="list" helper="난이도별 선정기준과 단가 반영률을 지정하세요"
                 class="col-xs-12">
          <q-list highlight separator>
            <q-list-header class="row justify-end">
              <div style="padding-right: 10px;">단가 반영률: 난이도에 따른 단가 변동을 의미합니다</div>
            </q-list-header>
            <q-item-separator/>
            <q-item v-for="grade in model.difficultyGrades" :key="grade.difficulty">
              <q-item-main>
                <q-item-tile>
                  {{difficultyLabel(grade.difficulty)}}
                </q-item-tile>
                <q-field class="col-12"
                         :helper="`'${difficultyLabel(grade.difficulty)}' 의 단가 반영률을 지정하세요`">
                  <q-slider
                      v-model="grade.costRate"
                      label-always
                      :label-value="`${Math.round(grade.costRate * 100 )}%`"
                      :min="0"
                      :max="2"
                      :step="0.01"
                      snap
                  />
                </q-field>
                <q-field class="col-12"
                         :helper="`'${difficultyLabel(grade.difficulty)}' 의 난이도 선정 기준을 입력하세요`"
                         :count="200">
                  <q-input type="textarea" v-model="grade.description"
                           rows="2"
                           max-length="200"/>
                </q-field>
              </q-item-main>
            </q-item>
          </q-list>
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
            <audit-viewer ref="auditViewer" :url="`/audit/process-type/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    ProcessDifficultyArray,
    ProcessInfoTypeLabelArray,
    ProcessTypeModel,
    ProcessInfoTypeModel
  } from 'src/model/process'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import * as _ from 'lodash'
  import QItemSeparator from "quasar-framework/src/components/list/QItemSeparator";

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
        model: new ProcessTypeModel(),
        infoTypeLabels: new ProcessInfoTypeLabelArray(),
        difficultyLabels: new ProcessDifficultyArray(),
        infoTypeModel: new ProcessInfoTypeModel()
      }
    },
    mounted () {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.infoTypeLabels.query()
      this.difficultyLabels.fetch()
    },
    methods: {
      difficultyLabel (value) {
        const label = this.difficultyLabels.find(data => data.value == value)
        return label ? label.label : ''
      },
      async onProcessInfoTypeSearch (keyword, done) {
        await this.infoTypeLabels.query(keyword)
        done()
      },
      async create () {
        this.model = new ProcessTypeModel()
      },
      async show () {
        this.model = await ProcessTypeModel.get(this.id)
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
        await this.model.save()
      }
    },
    computed: {
      totalCostRate () {
        let sum = 0
        _.forIn(this.model.costRates, (value, key) => {
          sum += value
        })
        return sum
      },
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
      QItemSeparator,
      AuditViewer
    }
  }
</script>
