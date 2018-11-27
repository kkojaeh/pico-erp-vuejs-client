<template>
  <q-page class="column fit">
    <q-toolbar>
      <q-toolbar-title>
        {{year}} / {{month}}
      </q-toolbar-title>
      <q-btn-group outline>
        <q-btn outline label="<<" @click="move(-12)"/>
        <q-btn outline label="<" @click="move(-1)"/>
        <q-btn outline label="Today" @click="moveNow()"/>
        <q-btn outline label=">" @click="move(1)"/>
        <q-btn outline label=">>" @click="move(12)"/>
      </q-btn-group>
    </q-toolbar>
    <div class="col-grow column">
      <kl-calendar class="col-grow work-schedule-calendar"
                   :week-title="weekTitle"
                   :render-title="renderTitle"
                   :render-content="renderContent"
                   :default-date="displayDate"
                   @date-click="onDateClick"/>
    </div>
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
        <q-select v-model="displayCategoryId"
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
    WorkScheduleArray,
    WorkScheduleCategoryArray,
    WorkScheduleGenerateOptions,
    WorkScheduleModel
  } from 'src/model/work-schedule'
  import Calendar from 'himmas-vue-calendar'

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
        array: new WorkScheduleArray(),
        displayDate: new Date(),
        categoryArray: new WorkScheduleCategoryArray(),
        displayCategoryId: this.categoryId,
        generating: false,
        generateOptions: new WorkScheduleGenerateOptions(),
        editing: false,
        selected: {
          workDay: new WorkScheduleModel(),
          workTime: null
        },
        dates: {},
        weekTitle: ['일', '월', '화', '수', '목', '금', '토']
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
      renderTitle(h, year, month) {
        return
      },
      renderContent(h, data) {
        const {
          date, isToday, isWeekend, isOtherMonthDay, year, day, month,
          renderYear, renderMonth, lunar, weekDay, festival, term
        } = data
        const workDay = this.dates[moment(date).format('YYYY-MM-DD')] || {times: []}
        const name = workDay.name || '일반날'
        const isHoliday = workDay.holiday
        const times = workDay.times.map(time => {
          const begin = moment(time.begin).format('HH:mm')
          const end = moment(time.end).format('HH:mm')
          return `${begin} ~ ${end}`
        })
        return h('div', {
          class: {
            'date-box': true,
            'today': isToday,
            'weekend': isWeekend,
            'holiday': isHoliday,
            'other-month': isOtherMonthDay
          }
        }, [
          h('div', {
            class: {
              'default-info': true,
              'row': true,
              'justify-between': true
            }
          }, [
            h('div', {
              class: {
                'day-of-month-info': true,
                'col': true
              }
            }, day), h('div', {
              class: {
                'name-info': true,
                'col': true
              }
            }, name)
          ]),
          h('div', {
            class: {
              'times-info': true
            }
          }, times.map(time => h('div', {}, time)))
        ])
      },
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
        await WorkScheduleModel.generate(this.generateOptions)
        this.refresh()
      },
      async refresh() {
        const displayDate = moment().year(this.year).month(this.month - 1).toDate()
        await this.retrieve(displayDate)
        this.displayDate = displayDate
      },
      async onTimeSelectionChanged(event) {
        const model = event.api.getSelectedRows()[0]
        this.selected.workTime = await WorkScheduleModel.get(model.id, false)
      },
      onAddWorkTime() {
        this.selected.workDay.times.push(new WorkTimeModel())
      },
      onRemoveWorkTime() {
        this.selected.workDay.times.remove(this.selected.workTime)
        this.selected.workTime = null
      },

      move(step) {
        this.go(moment(this.displayDate).add(step, 'months').toDate())
      },
      moveNow() {
        this.go(new Date())
      },
      go(date) {
        this.$router.push(
            `/work-schedule/${this.displayCategoryId}/${date.getFullYear()}/${date.getMonth() + 1}`)
      },
      onDateClick({date}) {
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

    components: {
      'kl-calendar': Calendar
    }
  }
</script>
<style lang="stylus">
  .work-schedule-calendar
    .title-box
      font-size: 20px
    .kl-calendar_body-week-title // 요일 표시
      :nth-child(7) // 토요일
        color: #6495ed
      :nth-child(1) // 일요일
        color: #ff4500
    .date-box
      position: absolute
      width: 100%
      height: 100%
      display: flex
      flex-direction: column
      box-sizing: border-box
      .default-info
        padding: 5px
        .day-of-month-info
          text-align: left
          font-size: 14px
          font-weight: bold
        .name-info
          text-align: right
          font-size: 12px
    .times-info
      text-align: center
      font-size: 11px

    .date-box.today
      background: #fb0
      color: #fff

    .date-box.today .name-info
      color: #fff

    .weekend
      background: #ff450011

    .date-box.other-month .day-of-month-info, .date-box.other-month .name-info
      color: #999

    .date-box:hover
      border: 3px solid #fb0

  /*.dhtmlx-scheduler-container
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
      min-width: calc(100% - 30px)
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
        color: #ff4500*/


</style>