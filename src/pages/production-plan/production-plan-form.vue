<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        생산 계획 정보
        <span slot="right" v-if="!!model.code">
          {{statusLabel}} - {{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-gift" helper="품목을 선택하세요"
                 :error="!!model.$errors.itemId"
                 :error-label="model.$errors.itemId"
                 class="col-xs-12 col-md-6 col-lg-8 col-xl-9">
          <q-input :prefix="itemModel.code" float-label="품목" :value="itemModel.name" clearable
                   :before="[{icon: 'open_in_new', condition: !!model.itemId, handler: onShowItem}]"
                   readonly hide-underline/>
        </q-field>

        <q-field icon="info" helper="요청 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.quantity"
                 :error-label="model.$errors.quantity">
          <q-input type="number" float-label="수량" v-model="model.quantity" align="right"
                   :readonly="!updatable" :hide-underline="!updatable"/>
          <q-tooltip>
            {{$number.words(model.quantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="warning" helper="여분 수량을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.spareQuantity"
                 :error-label="model.$errors.spareQuantity">
          <q-input type="number" float-label="여분 수량" v-model="model.spareQuantity" align="right"
                   :readonly="!updatable" :hide-underline="!updatable"/>
          <q-tooltip>
            {{$number.words(model.spareQuantity)}}
          </q-tooltip>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      :readonly="!updatable" :hide-underline="!updatable"
                      type="date"/>
        </q-field>

        <q-field icon="warning" helper="완료 수량 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.completedQuantity"
                 :error-label="model.$errors.completedQuantity">
          <q-input type="number" float-label="완료 수량" v-model="model.completedQuantity" align="right"
                   readonly hide-underline/>
          <q-tooltip>
            {{$number.words(model.completedQuantity)}}
          </q-tooltip>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        생산 상세 계획
      </q-card-title>

      <q-card-main class="row scroll-x">

        <div ref="gantt" class="col" style="min-width: 1024px">

        </div>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat icon="done" @click="onDetermine()" label="확정"
               v-if="determinable"></q-btn>
        <q-btn flat icon="cancel" @click="onCancel()" label="취소"
               v-if="cancelable"></q-btn>

        <q-btn flat icon="save" @click="onSave()" v-if="updatable" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

    <q-modal v-model="detailEditing">
      <q-card class="col-12" flat style="max-width:768px">
        <q-card-title>
          {{detailTitle}}
          <span slot="right">
            {{detailStatusLabel}}
          </span>
        </q-card-title>

        <q-card-separator/>

        <q-card-main class="row gutter-md">
          <q-field icon="check" helper="제품 생산 진행 방식을 결정하세요"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.progressType"
                   :error-label="editing.detail.$errors.progressType">
            <q-select float-label="진행 방법" v-model="editing.detail.progressType"
                      :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                      :options="progressTypes"></q-select>
          </q-field>

          <q-field icon="fas fa-building" helper="진행 회사 입니다"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.actorId"
                   :error-label="editing.detail.$errors.actorId">
            <c-autocomplete-select float-label="진행사" v-model="editing.detail.actorId"
                                   :label="actorModel.name" :options="companyLabelArray"
                                   label-field="label" value-field="value"
                                   :disabled="detailActorDisabled"
                                   :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                                   @search="onCompanySearch">
              <template slot="option" slot-scope="option">
                {{option.label}}<br>
                {{option.stamp}} - {{option.subLabel}}
              </template>
            </c-autocomplete-select>
          </q-field>

          <q-field icon="info" helper="수량을 입력하세요"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.quantity"
                   :error-label="editing.detail.$errors.quantity">
            <q-input type="number" float-label="수량" v-model="editing.detail.quantity" align="right"
                     :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                     :suffix="detailUnitLabel"/>
            <q-tooltip>
              {{$number.words(model.quantity)}}
            </q-tooltip>
          </q-field>

          <q-field icon="warning" helper="여분 수량을 입력하세요"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.spareQuantity"
                   :error-label="editing.detail.$errors.spareQuantity">
            <q-input type="number" float-label="여분 수량" v-model="editing.detail.spareQuantity"
                     align="right"
                     :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                     :suffix="detailUnitLabel"/>
            <q-tooltip>
              {{$number.words(editing.detail.spareQuantity)}}
            </q-tooltip>
          </q-field>

          <q-field icon="fas fa-calendar" helper="시작일시를 입력하세요"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.startDate"
                   :error-label="editing.detail.$errors.startDate">
            <q-datetime float-label="시작일시" v-model="editing.detail.startDate"
                        :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                        type="datetime"/>
          </q-field>

          <q-field icon="fas fa-calendar" helper="종료일시를 입력하세요"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.endDate"
                   :error-label="editing.detail.$errors.endDate">
            <q-datetime float-label="종료일시" v-model="editing.detail.endDate"
                        :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                        type="datetime"/>
          </q-field>

          <q-field icon="fas fa-building" helper="완료후 인수할 회사 입니다"
                   class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                   :error="!!editing.detail.$errors.receiverId"
                   :error-label="editing.detail.$errors.receiverId">
            <q-select float-label="인수사" v-model="editing.detail.receiverId"
                      :readonly="!detailUpdatable" :hide-underline="!detailUpdatable"
                      :options="receiverLabelArray"></q-select>
          </q-field>
        </q-card-main>

        <q-card-separator/>

        <q-card-actions align="around">
          <q-btn flat icon="arrow_back" v-close-overlay>닫기</q-btn>
          <q-btn flat icon="done" @click="onDetailDetermine()" label="확정"
                 v-if="detailDeterminable"></q-btn>
          <q-btn flat icon="delete" @click="onDetailDelete()" label="삭제"
                 v-if="detailDeletable"></q-btn>
          <q-btn flat icon="save" @click="onDetailSave()" v-if="detailUpdatable" label="저장"></q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {ItemModel, ItemViewer} from 'src/model/item'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {
    ProductionPlanDetailArray,
    ProductionPlanDetailModel,
    ProductionPlanDetailProgressTypeArray,
    ProductionPlanDetailStatusArray,
    ProductionPlanModel,
    ProductionPlanStatusArray
  } from 'src/model/production-plan'
  import Big from 'big.js'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import {UnitLabelArray} from 'src/model/shared'
  import ProductionPlanItemSpecCellRenderer from './production-plan-item-spec-cell-renderer.vue'
  import moment from 'moment'
  import Highcharts from 'highcharts'
  import * as _ from 'lodash'

  const dateScaleFormatters = {
    'year'(data) {
      return moment(data.value).format('YYYY')
    },
    'month'(data) {
      return moment(data.value).format('YYYY-MM')
    },
    'day'(data) {
      return moment(data.value).format('D(ddd)')
    },
    'week'(data) {
      const start = moment(data.value)
      const end = moment(start).day(7)
      return start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD')
    },
    'hour'(data) {
      const start = new Date(data.value)
      return moment(start).format('HH')
    }
  }

  const detailStatusColors = {
    "CREATED": "black",
    "DETERMINED": "blue",
    "CANCELED": "red",
    "COMPLETED": "green"
  }

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
        model: new ProductionPlanModel(),
        detailArray: new ProductionPlanDetailArray(),
        companyLabelArray: new CompanyLabelArray(),
        receiverLabelArray: [],
        itemModel: new ItemModel(),
        userLabelArray: new UserLabelArray(),
        requesterModel: new UserModel(),
        accepterModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new ProductionPlanStatusArray(),
        progressTypeArray: new ProductionPlanDetailProgressTypeArray(),
        progressTypes: [],
        actorModel: new CompanyModel(),
        receiverModel: new CompanyModel(),
        detailStatusLabelArray: new ProductionPlanDetailStatusArray(),
        editing: {
          detail: new ProductionPlanDetailModel()
        },
        detailEditing: false,
        ganttChart: null
      }
    },
    async mounted() {
      this.owner = await CompanyModel.owner()
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.progressTypeArray.fetch(),
        this.companyLabelArray.fetch(),
        this.detailStatusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      onShowItem() {
        const viewer = new ItemViewer(this)
        viewer.id = this.model.itemId
        viewer.show()
      },

      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },

      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      async create() {
        this.model = new ProductionPlanModel()
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await ProductionPlanModel.get(id)
        const details = new ProductionPlanDetailArray(model)
        this.model = model
        this.detailArray = details
        await this.refreshDetails()
      },
      async refreshDetails() {
        await this.detailArray.fetch()
        this.drawGantt()
      },
      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },
      async onSave() {
        let valid = ![
          await this.model.validate(),
          await this.itemArray.validate()
        ].includes(false)

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async save() {
        await this.model.save()
      },

      async onDetermine() {
        let validDetermine = await this.model.validateDetermine()
        if (validDetermine) {
          const ok = await this.$alert.confirm('계획을 확정 하시겠습니까?')
          if (ok) {
            await this.model.determine()
            this.$alert.positive('확정 되었습니다')
            await this.$await(1000)
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.determine)
        }
      },

      async onCancel() {
        const validCancel = await this.model.validateCancel()
        if (validCancel) {
          const ok = await this.$alert.confirm('계획을 취소 하시겠습니까?')
          if (ok) {
            await this.model.cancel()
            this.$alert.positive('취소 되었습니다')
            await this.$await(1000)
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.cancel)
        }
      },

      async onDetailSave() {
        let valid = await this.editing.detail.validate()

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.editing.detail.save()
            this.$alert.positive('저장 되었습니다')
            await this.refreshDetails()
            this.editing.detail = this.detailArray.find(
                detail => detail.id == this.editing.detail.id)
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },

      async onDetailDetermine() {
        let valid = ![
          await this.editing.detail.validate(),
          await this.editing.detail.validateDetermine()
        ].includes(false)

        if (valid) {
          const ok = await this.$alert.confirm('확정 하시겠습니까?')
          if (ok) {
            await this.editing.detail.save()
            await this.editing.detail.determine()
            this.$alert.positive('확정 되었습니다')
            this.detailEditing = false
            this.editing.detail = new ProductionPlanDetailModel()
            await this.load(this.id || this.model.id)
          }
        } else {
          this.$alert.warning(this.editing.detail.$errors.determine)
        }
      },

      async onDetailDelete() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          await this.editing.detail.delete()
          this.detailEditing = false
          this.editing.detail = new ProductionPlanDetailModel()
          await this.refreshDetails()
        }
      },

      async onGanttSelect(event) {
        const data = event.target

        const detail = await ProductionPlanDetailModel.get(data.id)
        await detail.fetchReference()
        //console.log(await detail.getLinkedUrl())
        const id = detail.id;
        const allowedProgressTypes = detail.allowedProgressTypes
        this.progressTypes = this.progressTypeArray.filter(
            e => allowedProgressTypes.includes(e.value))

        let dependedOns = this.detailArray
        .filter(detail => detail.dependencies.includes(id))
        .map(detail => detail.actorId)
        .filter(actorId => !!actorId)

        if (!dependedOns.length && detail.receiverId) {
          dependedOns = [detail.receiverId]
        }
        const receivers = await Promise.all(
            dependedOns.map(async id => await CompanyModel.get(id))
        )

        this.receiverLabelArray = receivers.map(company => {
          return {value: company.id, label: company.name}
        })
        if (!detail.receiverId && receivers.length == 1) {
          detail.receiverId = receivers[0].id
        }
        this.editing.detail = detail
        this.detailEditing = true
        this.$nextTick(() => data.select(false))
      },

      drawGantt() {
        const datas = this.detailArray.map(detail => {
          const o = {}
          o.id = detail.id
          o.start = Date.parse(detail.startDate)
          o.end = Date.parse(detail.endDate)
          o.dependency = detail.dependencies
          o.name = JSON.stringify({
            item: detail.item.name,
            itemSpec: detail.itemSpec.summary || '',
            quantity: detail.quantity,
            spareQuantity: detail.spareQuantity,
            process: detail.process.name || 'N/A',
            status: detail.status
          })

          o.completed = Number(
              new Big(detail.progressedQuantity).div(detail.quantity + detail.spareQuantity))

          o.progressCompany = detail.progressCompany
          o.progressType = _.get(
              this.progressTypeArray.find(type => type.value == detail.progressType), 'label',
              'N/A')
          o.process = detail.process
          return o
        })
        datas.forEach(data => {
          datas.filter(d => data.dependency.includes(d.id))
          .forEach(d => d.parent = data.id)
        })
        this.ganttChart = Highcharts.ganttChart(this.$refs.gantt, {

          chart: {
            spacingLeft: 1
          },

          title: {
            //text: 'Interactive Gantt Chart'
          },

          subtitle: {
            //text: 'Drag and drop points to edit'
          },

          exporting: {
            sourceHeight: 1748,
            sourceWidth: 2480,
            scale: 2
          },

          plotOptions: {
            series: {
              animation: false, // Do not animate dependency connectors
              dragDrop: {
                draggableX: true
              },
              dataLabels: {
                enabled: true,
                formatter: function () {
                  const point = this.point
                  const completed = Number((point.completed || 0) * 100).toFixed(1)
                  const progress = _.get(point.progressCompany, 'name', 'N/A')
                  const progressType = point.progressType
                  return `${progressType} : ${progress} ( ${completed}% )`
                },
                style: {
                  cursor: 'default',
                  pointerEvents: 'none'
                }
              },
              allowPointSelect: true,
              point: {
                events: {
                  select: this.onGanttSelect
                }
              },
              tooltip: {
                //pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.start}</b><br/>',
                pointFormatter: function () {
                  const start = moment(this.start).format('YYYY-MM-DD HH:mm')
                  const end = moment(this.end).format('YYYY-MM-DD HH:mm')
                  return `${start} ~ ${end}`
                },
                xDateFormat: "%Y-%m-%d %H:%M"
              }
            }
          },

          yAxis: [{
            grid: {
              enabled: true
            },
            labels: {
              useHTML: true,
              formatter: function () {
                const o = JSON.parse(this.value)
                const color = detailStatusColors[o.status]
                return '<div class="hightcharts-gantt-production-plan-name-wrapper">'
                    + `<div style="color:${color}">${o.item} <small>${o.itemSpec}</small></div>`
                    + `<small>${o.process}&nbsp;-&nbsp;${o.quantity}/${o.spareQuantity}</small></div>`
              }
            },
            type: "treegrid"
          }],
          xAxis: [{
            //currentDateIndicator: true,
            labels: {
              formatter: function () {
                return dateScaleFormatters[this.tickPositionInfo.unitName](this)
              }
            }
          }, {
            //currentDateIndicator: true,
            labels: {
              formatter: function () {
                return dateScaleFormatters[this.tickPositionInfo.unitName](this)
              }
            }
          }],

          tooltip: {
            xDateFormat: '%a %b %d, %H:%M'
          },

          series: [{
            name: '생산 계획',
            data: datas
          }]
        });
      }

    },
    beforeDestroy() {
      if (this.ganttChart) {
        this.ganttChart.destroy()
        this.ganttChart = null
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      phantom() {
        return this.model.phantom
      },
      updatable() {
        return this.model.updatable
      },
      determinable() {
        return this.model.determinable
      },
      cancelable() {
        return this.model.cancelable
      },
      detailTitle() {
        const item = _.get(this.editing.detail, 'item.name', 'N/A')
        const process = _.get(this.editing.detail, 'process.name', 'N/A')
        return `${item} - ${process}`
      },
      statusLabel() {
        const status = this.model.status
        const found = this.statusLabelArray.find(e => e.value == status) || {}
        return found.label || ''
      },
      detailStatusLabel() {
        const status = this.editing.detail.status
        const found = this.detailStatusLabelArray.find(e => e.value == status) || {}
        return found.label || ''
      },
      detailDeterminable() {
        return this.editing.detail.determinable
      },
      detailDeletable() {
        return this.editing.detail.deletable
      },
      detailUpdatable() {
        return this.editing.detail.updatable
      },
      detailActorDisabled() {
        return this.editing.detail.progressType == 'PRODUCE'
      },

      detailUnitLabel() {
        const unit = this.editing.detail.unit
        const found = this.unitLabelArray.find(e => e.value == unit) || {}
        return found.label || ''
      }
    },
    watch: {
      'model.accepterId': async function (to) {
        this.accepterModel = await UserModel.get(to, true)
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
      },
      'model.itemId': async function (to) {
        this.itemModel = await ItemModel.get(to, true)
      },
      'editing.detail.actorId': async function (to) {
        this.actorModel = await CompanyModel.get(to, true)
      },
      'editing.detail.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
      },
      'editing.detail.progressType': async function (to) {
        if (to == 'PRODUCE') {
          this.editing.detail.actorId = this.owner.id
        }
      }
    },
    components: {
      CommentList,
      ProductionPlanItemSpecCellRenderer
    }
  }
</script>
<style lang="stylus">
  .hightcharts-gantt-production-plan-name-wrapper
    line-height: 1
</style>
