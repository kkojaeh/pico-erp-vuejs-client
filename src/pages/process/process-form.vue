<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        공정 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="공정의 이름 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input v-model="name" float-label="이름" class="ime-mode-active" readonly
                   hide-underline/>
        </q-field>

        <q-field icon="account_box" helper="공정 유형을 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.typeId"
                 :error-label="model.$errors.typeId">
          <c-autocomplete-select float-label="공정 유형" v-model="model.typeId"
                                 :label="typeModel.name" :options="processTypeLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onProcessTypeSearch" :readonly="typeFixed"
                                 :hide-underline="typeFixed">
            <template slot="option" slot-scope="option">
              {{option.label}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-comment" helper="공정 난이도를 지정하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="난이도" v-model="model.difficulty"
                    :options="difficultyLabelArray"></q-select>
        </q-field>

        <q-field icon="error" helper="공정의 손실률 입니다"
                 :error="!!model.$errors.lossRate"
                 :error-label="model.$errors.lossRate"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input type="number" v-model="lossRatePercentage" float-label="손실률" align="right"
                   suffix="%" :decimals="2"/>
        </q-field>

        <!--        <q-field icon="account_box" helper="공정의 관리자를 선택하세요"
                         class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                         :error="!!model.$errors.managerId"
                         :error-label="model.$errors.managerId">
                  <c-autocomplete-select float-label="관리자" v-model="model.managerId"
                                         :label="managerModel.name" :options="userLabelArray"
                                         label-field="label" value-field="value"
                                         @search="onManagerSearch">
                    <template slot="option" slot-scope="option">
                      {{option.label}}<br>
                      {{option.stamp}} - {{option.subLabel}}
                    </template>
                  </c-autocomplete-select>
                </q-field>-->

        <q-field icon="check" helper="공정의 상태 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabelArray"></q-select>
        </q-field>

        <q-field icon="monetization_on" helper="자동 산출된 단가를 조정할 금액을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.adjustCost"
                 :error-label="model.$errors.adjustCost">
          <q-input type="number" float-label="단가 조정" v-model="model.adjustCost" align="right"/>
          <q-tooltip>
            {{$number.words(model.adjustCost)}}
          </q-tooltip>
        </q-field>

        <q-field icon="description" helper="단가를 조정한 이유를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-4"
                 :error="!!model.$errors.adjustCostReason"
                 :error-label="model.$errors.adjustCostReason"
                 :count="200">
          <q-input type="textarea" v-model="model.adjustCostReason" float-label="단가 조정 사유"
                   rows="5"
                   max-length="200"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-xs-12 col-md-12 col-lg-12 col-xl-6" flat v-if="!phantom">

      <q-card-title>
        공정 준비
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="column">
        <ag-grid ref="userGrid" class="col-auto"
                 :grid-auto-height="true"
                 enable-col-resize
                 enable-sorting
                 :row-data="preprocessArray">

          <ag-grid-column field="name" header-name="이름" :width="300"/>
          <ag-grid-column field="chargeCost" header-name="기준단가" :width="100"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          :cell-style="{textAlign: 'right'}"/>
        </ag-grid>
      </q-card-main>
    </q-card>

    <q-card class="col-xs-12 col-md-12 col-lg-12 col-xl-6" flat v-if="!phantom">

      <q-card-title>
        단가
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">
        <div ref="estimatedCostChartContainer">
        </div>
      </q-card-main>
    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        설명
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-comment" helper="공정 설명을 입력하세요"
                 class="col-xs-12 col-md-10 col-xl-8"
                 :error="!!model.$errors.description"
                 :error-label="model.$errors.description">
          <c-html-editor v-model="model.description" :readonly="!isModifiable"></c-html-editor>
        </q-field>

        <!--<q-field icon="attachment" helper="공정 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-10 col-xl-8">

          <c-attachment ref="attachment" v-model="model.attachmentId" category="process"
                        multiple :readonly="!isModifiable"></c-attachment>
        </q-field>-->

      </q-card-main>

    </q-card>

    <!--<q-card v-if="model.commentSubjectId" class="col-12" flat>

      <q-card-title>
        댓글
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <comment-list class="col-xs-12 col-md-11 col-xl-11 no-border" :readonly="!isCommentable"
                      subject-type="process" :subject="model.commentSubjectId"></comment-list>

      </q-card-main>

    </q-card>-->

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn v-if="canCompletePlan" flat icon="save" @click="onCompletePlan()">가확정</q-btn>
        <q-btn v-if="isModifiable" flat icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {
    ProcessDifficultyArray,
    ProcessModel,
    ProcessPreparationArray,
    ProcessStatusArray,
    ProcessTypeLabelArray,
    ProcessTypeModel
  } from 'src/model/process'
  import {UserLabelArray} from 'src/model/user'
  import Big from 'big.js'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import Highcharts from 'highcharts'

  const estimatedCostTypes = [
    'directLabor',
    'indirectLabor',
    'indirectMaterial',
    'indirectExpenses'
  ]
  const estimatedCostNames = {
    'directLabor': '직접 노무비',
    'indirectLabor': '간접 노무비',
    'indirectMaterial': '간접 재료비',
    'indirectExpenses': '간접 경비'
  }

  export default {
    authorized: {
      'processManager': 'hasRole(\'PROCESS_MANAGER\')'
    },
    props: {
      action: {
        type: String
      },
      itemId: {
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
        model: new ProcessModel(),
        typeModel: new ProcessTypeModel(),
        processTypeLabelArray: new ProcessTypeLabelArray(),
        difficultyLabelArray: new ProcessDifficultyArray(),
        statusLabelArray: new ProcessStatusArray(),
        userLabelArray: new UserLabelArray(),
        preprocessArray: new ProcessPreparationArray()
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.processTypeLabelArray.fetch()
      this.difficultyLabelArray.fetch()
      this.statusLabelArray.fetch()
      this.userLabelArray.fetch()
    },
    methods: {
      createEstimatedCostChart() {
        if (!this.$refs.estimatedCostChartContainer) {
          return
        }
        const sum = estimatedCostTypes
        .map(type => this.model.estimatedCost[type])
        .reduce((acc, value) => {
          return acc + value
        }, 0)
        const series = estimatedCostTypes
        .map(type => {
          return {
            name: estimatedCostNames[type],
            y: this.model.estimatedCost[type]
          }
        })

        Highcharts.chart(this.$refs.estimatedCostChartContainer, {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: `추정 단가 ${sum}`
          },
          tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> {point.y}',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: [{
            colorByPoint: true,
            data: series
          }]
        })
      },
      async onProcessTypeSearch(keyword) {
        await this.processTypeLabelArray.fetch(keyword)
      },
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async create() {
        this.model = new ProcessModel({
          itemId: this.itemId
        })
        this.typeModel = new ProcessTypeModel()
        this.preprocessArray = new ProcessPreparationArray(this.model)
        this.createEstimatedCostChart()
      },
      async load(id) {
        this.model = await ProcessModel.get(id)
        this.typeModel = await ProcessTypeModel.get(this.model.typeId)
        //this.managerModel = await UserModel.get(this.model.managerId)
        const preprocessArray = new ProcessPreparationArray(this.model)
        await preprocessArray.fetch()
        this.preprocessArray = preprocessArray
        this.createEstimatedCostChart()
      },
      async show() {
        this.load(this.id)
      },
      async onSaveClick() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$emit('saved', this.model)
            this.$alert.positive('저장 되었습니다')
            if (this.closable && !this.closeConfirmed) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
                return
              }
            }
            this.load(this.model.id)
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        /*const attachment = this.$refs.attachment
        await attachment.save()*/
        await this.model.save()
      },

      async onCompletePlan() {
        let valid = await this.model.validate()
        if (!valid) {
          this.$alert.warning('입력이 유효하지 않습니다')
          return
        }
        let validCompletePlan = await this.model.validateCompletePlan()
        if (validCompletePlan) {
          const ok = await this.$alert.confirm('가확정 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.completePlan()
            this.$emit('saved', this.model)
            this.$alert.positive('가확정 되었습니다')
            if (this.closable && !this.closeConfirmed) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
                return
              }
            }
            this.load(this.model.id)
          }
        } else {
          this.$alert.warning(this.model.$errors.completePlan)
        }
      }
    },
    computed: {
      isModifiable() {
        return this.$authorized.processManager && !this.model.deleted
      },
      /*isCommentable() {
        return !this.model.deleted
      },*/
      phantom() {
        return this.model.phantom
      },
      canCompletePlan() {
        return this.model.canCompletePlan
      },
      typeFixed() {
        return this.model.typeFixed
      },
      name() {
        if (this.model.name) {
          return this.model.name
        }
        return this.typeModel.name || 'N/A'
      },
      lossRatePercentage: {
        get() {
          return Number(new Big(this.model.lossRate).times(100))
        },
        set(value) {
          this.model.lossRate = Number(new Big(value).div(100))
        }
      }
    },
    watch: {
      'model.typeId': async function (to) {
        this.typeModel = await ProcessTypeModel.get(to, true)
        if (!this.typeFixed) {
          this.model.lossRate = this.typeModel.lossRate
        }
      }/*,
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      }*/
    },
    components: {
      CommentList
    }
  }
</script>
