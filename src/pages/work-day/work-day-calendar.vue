<template>
  <q-page class="column fit">
    <dhtmlx-scheduler ref="scheduler" :templates="schedulerTemplates" :display-date="displayDate"
                      :config="schedulerConfig"
                      class="col-grow" @view-change="onViewChange" @empty-click="onEmptyClick"
    />

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_drop_down">
          <q-popover>
            <q-btn flat icon="add" label="작업일 수동 생성" @click="generating = true">
              <q-modal v-model="generating">
                <q-card flat>
                  <q-card-main class="row">
                    <q-field icon="date_range" helper="수동 생성의 범위를 입력하세요">
                      <q-datetime v-model="generateOptions.begin" :max="generateOptions.end"
                                  type="date" float-label="시작일" class="col-6"/>
                    </q-field>
                    <q-field icon="date_range" helper="수동 생성의 범위를 입력하세요">
                      <q-datetime v-model="generateOptions.end" :min="generateOptions.begin"
                                  type="date" float-label="종료일" class="col-6"/>
                    </q-field>
                  </q-card-main>
                  <q-card-actions align="end">
                    <q-btn flat icon="add" label="작업일 수동 생성" @click="generate"
                           v-close-overlay></q-btn>
                  </q-card-actions>
                </q-card>
              </q-modal>
            </q-btn>
          </q-popover>
        </q-btn>
        <q-select float-label="유형" v-model="displayCategoryId"
                  :options="categoryArray" dark></q-select>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="save" label="저장"></q-btn>
      </q-toolbar>

      <q-modal v-model="editing">
        <q-card class="col-12" flat>
          <q-card-title>
            {{$date.format(selected.workDay.date, 'YYYY-MM-DD')}}
          </q-card-title>

          <q-card-separator/>

          <q-card-main class="row gutter-md">
            <q-field icon="account_circle" helper="이름을 입력하세요(행사 등)"
                     class="col-12"
                     :error="!!selected.workDay.$errors.name"
                     :error-label="selected.workDay.$errors.name">
              <q-input v-model="selected.workDay.name" float-label="이름"
                       :hide-underline="!selected.workDay.modifiable"
                       :readonly="!selected.workDay.modifiable"/>
            </q-field>
            <q-field icon="check_circle" helper="휴일 여부 입니다"
                     class="col-12">
              <q-toggle label="휴일 여부" v-model="selected.workDay.holiday"
                        :hide-underline="!selected.workDay.modifiable"
                        :disable="!selected.workDay.modifiable"/>
            </q-field>
          </q-card-main>

          <q-card-title>
            근무 시간
            <div slot="right" class="row items-center">
              <q-btn flat color="secondary" label="추가" icon="add" @click="onAddWorkTime"
                     v-if="selected.workDay.modifiable"/>
              <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.workTime"
                     v-if="selected.workDay.modifiable"
                     @click="onRemoveWorkTime"/>
            </div>
          </q-card-title>

          <q-card-separator/>

          <q-card-main class="row">

            <ag-grid class="col"
                     ref="timeGrid"
                     :grid-auto-height="true"
                     row-selection="single"
                     enable-col-resize
                     :editable="selected.workDay.modifiable"
                     suppress-no-rows-overlay
                     @selection-changed="onTimeSelectionChanged"
                     :row-data="selected.workDay.times">

              <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
              <ag-grid-column field="begin" header-name="시작시간" :width="100"
                              :editable="selected.workDay.modifiable"
                              cell-renderer-framework="ag-grid-datetime-renderer"
                              :cell-renderer-params="{format: 'HH:mm'}"
                              cell-editor-framework="ag-grid-datetime-editor"
                              :cell-style="{textAlign: 'center'}"
                              :cell-editor-params="{ type: 'time', format24h:true }"/>
              <ag-grid-column field="end" header-name="종료시간" :width="100"
                              :editable="selected.workDay.modifiable"
                              cell-renderer-framework="ag-grid-datetime-renderer"
                              :cell-renderer-params="{format: 'HH:mm'}"
                              cell-editor-framework="ag-grid-datetime-editor"
                              :cell-style="{textAlign: 'center'}"
                              :cell-editor-params="{ type: 'time', format24h:true }"/>
            </ag-grid>

          </q-card-main>

          <q-card-separator/>

          <q-card-actions align="end">
            <q-btn flat icon="save" label="저장" @click="onSaveWorkTime"
                   :disable="!selected.workDay.modifiable"></q-btn>
          </q-card-actions>
        </q-card>
      </q-modal>

    </q-page-sticky>
  </q-page>

</template>
<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex'
  import {
    WorkDayArray,
    WorkDayCategoryArray,
    WorkDayGenerateOptions,
    WorkDayModel,
    WorkTimeModel
  } from 'src/model/work-day'

  export default {
    props: {
      categoryId: {
        type: String
      },
      year: {
        type: Number
      },
      month: {
        type: Number
      }
    },
    data() {
      return {
        array: new WorkDayArray(),
        displayDate: new Date(),
        categoryArray: new WorkDayCategoryArray(),
        displayCategoryId: this.categoryId,
        generating: false,
        generateOptions: new WorkDayGenerateOptions(),
        editing: false,
        selected: {
          workDay: new WorkDayModel(),
          workTime: null
        },
        dates: {},
        schedulerConfig: {
          dblclick_create: false,
          details_on_create: false,
          details_on_dblclick: false
        },
        schedulerTemplates: {
          month_day: this.monthDayTemplate,
          month_date_class: this.monthDateClassTemplate,
          month_scale_date: this.monthScaleDateTemplate
        }
      }
    },
    async mounted() {
      await this.categoryArray.fetch()
      if (this.categoryArray.length) {
        if (!this.displayCategoryId) {
          this.displayCategoryId = this.categoryArray[0].value
        }
      } else {
        this.$alert.error('작업일 유형이 없습니다')
        return
      }
      if (!this.year || !this.month) {
        this.go(new Date())
        return
      }
      this.refresh()
    },
    methods: {
      monthScaleDateTemplate(date) {
        const scheduler = this.$refs.scheduler.scheduler
        const formatter = scheduler.date.date_to_str(scheduler.config.week_date)
        const value = formatter(date)
        if (date.getDay() == 0) {
          return `<span class="dhx_scale_sunday">${value}</span>`
        }
        if (date.getDay() == 6) {
          return `<span class="dhx_scale_saturday">${value}</span>`
        }
        return value;
      },
      async generate() {
        await WorkDayModel.generate(this.generateOptions)
        this.refresh()
      },
      async refresh() {
        const displayDate = moment().year(this.year).month(this.month - 1).toDate()
        await this.retrieve(displayDate)
        this.displayDate = displayDate
      },
      async onTimeSelectionChanged(event) {
        const model = event.api.getSelectedRows()[0]
        this.selected.workTime = await WorkDayModel.get(model.id, false)
      },
      onAddWorkTime() {
        this.selected.workDay.times.push(new WorkTimeModel())
      },
      onRemoveWorkTime() {
        this.selected.workDay.times.remove(this.selected.workTime)
        this.selected.workTime = null
      },
      monthDateClassTemplate(date) {
        const workDay = this.dates[moment(date).format('YYYY-MM-DD')]
        const cls = []
        if (workDay && workDay.holiday) {
          cls.push('dthmlx-scheduler-holiday')
        }
        if (date.getDay() == 0) {
          cls.push("dthmlx-scheduler-sunday")
        }
        if (date.getDay() == 6) {
          cls.push("dthmlx-scheduler-saturday")
        }
        return cls.join(' ')
      },
      monthDayTemplate(date) {
        const workDay = this.dates[moment(date).format('YYYY-MM-DD')]
        if (workDay) {
          const name = workDay.name ? workDay.name : ''
          const times = workDay.times.map(time => {
            const begin = moment(time.begin).format('HH:mm')
            const end = moment(time.end).format('HH:mm')
            return `${begin} ~ ${end}`
          }).join('<br>')
          return `<span class="dhx_month_head_name">${name}</span>`
              + `<span class="dhx_month_head_times">${times}</span>`
              + `<span class="dhx_month_head_day">${date.getDate()}</span>`
        } else {
          return `<span class="dhx_month_head_day">${date.getDate()}</span>`
        }
      },
      go(date) {
        this.$router.push(
            `/work-day/${this.displayCategoryId}/${date.getFullYear()}/${date.getMonth() + 1}`)
      },
      onViewChange({newMode, newDate}) {
        this.go(newDate)
      },
      onEmptyClick({date, e}) {
        const workDay = this.dates[moment(date).format('YYYY-MM-DD')]
        if (workDay) {
          this.selected.workDay = workDay
          this.editing = true
        }
      },
      async onSaveWorkTime() {
        const model = this.selected.workDay
        const valid = await model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await model.save()
            this.$alert.positive('저장 되었습니다')
            this.editing = false
            this.refresh()
          }
        } else {
          this.$redrawGrids()
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async retrieve(date) {
        const begin = moment(date).date(1);
        const end = moment(begin).add(1, 'months').add(-1, 'days');
        await this.array.fetch(
            this.displayCategoryId,
            begin.add(-7, 'days').format('YYYY-MM-DD'),
            end.add(7, 'days').format('YYYY-MM-DD')
        )
        this.dates = {}
        this.array.forEach(workDay => this.dates[workDay.date] = workDay)
      }
    },
    computed: {
      ...mapGetters([])
    },

    watch: {
      '$route.params.year'(to) {
        this.year = Number(to)
        this.refresh()
      },
      '$route.params.month'(to) {
        this.month = Number(to)
        this.refresh()
      },
      '$route.params.categoryId'(to) {
        this.displayCategoryId = to
        this.refresh()
      },
      'displayCategoryId'(to) {
        this.go(this.displayDate)
      }
    },

    components: {}
  }
</script>
<style lang="stylus">
  .dhtmlx-scheduler-container
    .dthmlx-scheduler-saturday .dhx_month_head_day
      color: cornflowerblue
    .dthmlx-scheduler-sunday .dhx_month_head_day
      color: orangered
    .dhx_after.dthmlx-scheduler-saturday .dhx_month_head_day
      color: #6495ed 66
    .dhx_after.dthmlx-scheduler-sunday .dhx_month_head_day
      color: #ff450066
    .dhx_before.dthmlx-scheduler-saturday .dhx_month_head_day
      color: #6495ed 66
    .dhx_before.dthmlx-scheduler-sunday .dhx_month_head_day
      color: #ff450066
    .dthmlx-scheduler-holiday
      background: #ff450022
      *
        background: transparent
    .dhx_before.dthmlx-scheduler-holiday
      background: #ff450011
      *
        background: transparent
    .dhx_after.dthmlx-scheduler-holiday
      background: #ff450011
      *
        background: transparent

    .dhx_month_head_name
      float: left
      margin-left: 10px
      min-width: 50%
      height: 20px
      text-align: left

    .dhx_month_head_times
      float: left
      margin-left: 10px
      line-height: 12px

    .dhx_scale_bar
      .dhx_scale_saturday
        color: #6495ed
      .dhx_scale_sunday
        color: #ff4500


</style>