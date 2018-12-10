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
                                 :label="infoTypeModel.name" :options="infoTypeLabelArray"
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

        <q-field icon="error" helper="공정유형의 손실률 입니다"
                 :error="!!model.$errors.lossRate"
                 :error-label="model.$errors.lossRate"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input type="number" v-model="lossRatePercentage" float-label="손실률" align="right"
                   suffix="%" :decimals="2"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-md-4 col-xl-4" flat>

      <q-card-title>
        사전 공정 유형 정보
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="column">
        <ag-grid class="col-auto"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 enable-sorting
                 :row-data="preprocessTypeArray">
          <ag-grid-column field="selected" header-name="사용" :width="120" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"
                          cell-editor-framework="ag-grid-checkbox-editor"
                          :editable="true"/>
          <ag-grid-column field="name" header-name="이름" :width="200"/>
          <ag-grid-column field="baseCost" header-name="기준단가" :width="100"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          :cell-style="{textAlign: 'right'}"/>
        </ag-grid>
      </q-card-main>
    </q-card>

    <q-card class="col-xs-12 col-md-4 col-xl-4" flat>

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

    <q-card class="col-xs-12 col-md-4 col-xl-4" flat>

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
            <q-item v-for="(grade, difficulty) in model.difficulties" :key="difficulty">
              <q-item-main>
                <q-item-tile>
                  {{difficultyLabel(difficulty)}}
                </q-item-tile>
                <q-field class="col-12"
                         :helper="`'${difficultyLabel(difficulty)}' 의 단가 반영률을 지정하세요`">
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
                         :helper="`'${difficultyLabel(difficulty)}' 의 난이도 선정 기준을 입력하세요`"
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
        <q-btn flat color="tertiary" icon="fas fa-history"
               @click="$showAudit(`/audit/process-type/${model.id}`)"
               v-show="!phantom" label="이력">
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    PreprocessTypeArray,
    ProcessDifficultyArray,
    ProcessInfoTypeLabelArray,
    ProcessInfoTypeModel,
    ProcessTypeModel,
    ProcessTypePreprocessTypeArray,
  } from 'src/model/process'
  import Big from 'big.js'
  import * as _ from 'lodash'

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
        model: new ProcessTypeModel(),
        infoTypeLabelArray: new ProcessInfoTypeLabelArray(),
        difficultyLabelArray: new ProcessDifficultyArray(),
        infoTypeModel: new ProcessInfoTypeModel(),
        preprocessTypeArray: new ProcessTypePreprocessTypeArray(),
        selected: {}
      }
    },
    async mounted() {
      await Promise.all([
        await this.infoTypeLabelArray.fetch(),
        await this.difficultyLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      difficultyLabel(value) {
        const label = this.difficultyLabelArray.find(data => data.value == value)
        return label ? label.label : ''
      },

      async onProcessInfoTypeSearch(keyword, done) {
        await this.infoTypeLabelArray.fetch(keyword)
        done()
      },
      async create() {
        const model = new ProcessTypeModel()
        const preprocessTypeArray = new ProcessTypePreprocessTypeArray(model)
        const preprocessTypes = new PreprocessTypeArray()
        await preprocessTypes.fetch()
        preprocessTypes.forEach(preprocessType => preprocessType.selected = false)
        preprocessTypeArray.push(...preprocessTypes)
        this.model = model
        this.preprocessTypeArray = preprocessTypeArray
      },
      async load(id) {
        const model = await ProcessTypeModel.get(id)
        const preprocessTypeArray = new ProcessTypePreprocessTypeArray(model)
        const preprocessTypes = new PreprocessTypeArray()
        await preprocessTypes.fetch()
        const selected = model.preprocessTypes.map(preprocessType => preprocessType.id)
        preprocessTypes.forEach(preprocessType => {
          preprocessType.selected = selected.includes(preprocessType.id)
          preprocessType.snapshot()
        })
        preprocessTypeArray.push(...preprocessTypes)
        this.model = model
        this.preprocessTypeArray = preprocessTypeArray
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
            if (this.closable) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
                return
              }
            }
            this.load(this.id)
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        await this.model.save()
        await this.preprocessTypeArray.save()
      }
    },
    computed: {
      lossRatePercentage: {
        get() {
          return Number(new Big(this.model.lossRate).times(100))
        },
        set(value) {
          this.model.lossRate = Number(new Big(value).div(100))
        }
      },
      totalCostRate() {
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
    components: {}
  }
</script>
