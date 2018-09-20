<template>
  <q-page class="column fit">
    <ag-grid class="col ag-grid-scheduler"
             row-selection="single"
             enable-sorting
             :row-data="array">
      <ag-grid-column field="name" header-name="설비명" pinned="left"/>
      <ag-grid-column v-for="week in weeks" :field="week.value" :header-name="week.label"
                      :key="week.label" :width="week.width">
        <ag-grid-column v-for="day in week.days" :field="day.value" :header-name="day.label"
                        :key="day.value" :width="day.width" suppress-sorting
                        cell-renderer-framework="schedule-cell-renderer"
                        :cell-renderer-params="{dayTimes:dayTimes}">
          <ag-grid-column v-if="day.hours && day.hours.length" v-for="hour in day.hours"
                          :field="hour.value" :header-name="hour.label"
                          :key="hour.value"></ag-grid-column>
        </ag-grid-column>
      </ag-grid-column>
    </ag-grid>
  </q-page>

</template>
<script>
  import moment from 'moment'
  import ScheduleCellRenderer from './schedule-cell-renderer.vue'

  const workDays = [{
    "id": "78601c2b-f0d3-49d2-a760-70af8759fdc1",
    "name": null,
    "holiday": true,
    "date": "2018-09-01",
    "categoryId": "global",
    "times": []
  }, {
    "id": "1cf9936f-fa14-4597-a56a-8411ba072e1b",
    "name": null,
    "holiday": true,
    "date": "2018-09-02",
    "categoryId": "global",
    "times": []
  }, {
    "id": "1924b78b-c811-4e0d-a466-6d5385866618",
    "name": null,
    "holiday": false,
    "date": "2018-09-03",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "d73709cf-97f4-49cd-a555-fad619dc7bc2",
    "name": null,
    "holiday": false,
    "date": "2018-09-04",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "f2ea940c-a051-431e-8480-53de70b1be96",
    "name": null,
    "holiday": false,
    "date": "2018-09-05",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "ac702054-5f68-4dd2-82be-e35a8041a481",
    "name": null,
    "holiday": false,
    "date": "2018-09-06",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "6262e82d-0e12-4a46-bef9-480f20ec4311",
    "name": null,
    "holiday": false,
    "date": "2018-09-07",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "65d54935-d502-42ea-9f87-7833e3c7d676",
    "name": null,
    "holiday": true,
    "date": "2018-09-08",
    "categoryId": "global",
    "times": []
  }, {
    "id": "a1b7f811-68dd-4dcc-bd31-2179f71691f1",
    "name": null,
    "holiday": true,
    "date": "2018-09-09",
    "categoryId": "global",
    "times": []
  }, {
    "id": "d0790f5f-59c7-4fc8-a2b1-50c98bea0058",
    "name": null,
    "holiday": false,
    "date": "2018-09-10",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "32b80cad-bcf1-4962-8947-100de478124d",
    "name": null,
    "holiday": false,
    "date": "2018-09-11",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "b556fb2b-3d2c-4cec-acc6-84c5303ea89d",
    "name": null,
    "holiday": false,
    "date": "2018-09-12",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "773beb08-e93b-4ce2-9667-f65b91ac753d",
    "name": null,
    "holiday": false,
    "date": "2018-09-13",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "b286e849-0a09-4a72-979c-f00d4f77209b",
    "name": null,
    "holiday": false,
    "date": "2018-09-14",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "71619bb2-7311-47f7-b37d-b05c9df0255e",
    "name": null,
    "holiday": true,
    "date": "2018-09-15",
    "categoryId": "global",
    "times": []
  }, {
    "id": "3cbf214d-474a-481c-980c-d761b7552541",
    "name": null,
    "holiday": true,
    "date": "2018-09-16",
    "categoryId": "global",
    "times": []
  }, {
    "id": "c3d4859f-0aaa-400c-8bd6-1ecb30019488",
    "name": null,
    "holiday": false,
    "date": "2018-09-17",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "0e54efa5-6845-4934-b6b3-401cdef2c305",
    "name": null,
    "holiday": false,
    "date": "2018-09-18",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "622e8872-ef46-4fa3-8c64-57b64af3316e",
    "name": null,
    "holiday": false,
    "date": "2018-09-19",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "8578caa8-5063-4f72-9cd5-b1767c498f45",
    "name": null,
    "holiday": false,
    "date": "2018-09-20",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "f4fcb6d3-b0ef-4436-a6d1-a58b5849b9f8",
    "name": null,
    "holiday": false,
    "date": "2018-09-21",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "8e1fbae9-2964-4d25-896f-77a4f931f745",
    "name": null,
    "holiday": true,
    "date": "2018-09-22",
    "categoryId": "global",
    "times": []
  }, {
    "id": "46882b32-d933-4f70-9b18-0d5b5efcdfd0",
    "name": "추석 연휴",
    "holiday": true,
    "date": "2018-09-23",
    "categoryId": "global",
    "times": []
  }, {
    "id": "1d85345b-094a-4b12-b836-4ef1ff1d264c",
    "name": "추석",
    "holiday": true,
    "date": "2018-09-24",
    "categoryId": "global",
    "times": []
  }, {
    "id": "5afe7741-225e-4683-b493-9ee86babd8e7",
    "name": "추석 연휴",
    "holiday": true,
    "date": "2018-09-25",
    "categoryId": "global",
    "times": []
  }, {
    "id": "0ee2b193-a71a-441a-9eeb-a1d50cc478d3",
    "name": "추석 연휴(대체 휴일)",
    "holiday": true,
    "date": "2018-09-26",
    "categoryId": "global",
    "times": []
  }, {
    "id": "132ce4ff-6eb6-4761-b2f3-2e63a99db086",
    "name": null,
    "holiday": false,
    "date": "2018-09-27",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "64d81c59-7413-40e2-9d6e-de1203677fa2",
    "name": null,
    "holiday": false,
    "date": "2018-09-28",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "0101954f-4fa9-4040-8605-c9bbdc57736c",
    "name": null,
    "holiday": true,
    "date": "2018-09-29",
    "categoryId": "global",
    "times": []
  }, {
    "id": "0c77d4b7-768a-4398-8c3e-54943bb2ab29",
    "name": null,
    "holiday": true,
    "date": "2018-09-30",
    "categoryId": "global",
    "times": []
  }, {
    "id": "fa70900e-0ed3-434b-8ffc-3e254ad5ddaf",
    "name": null,
    "holiday": false,
    "date": "2018-10-01",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "7d613b00-e1dc-4e58-9947-70090390e057",
    "name": null,
    "holiday": false,
    "date": "2018-10-02",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "4ce5ebf6-32e9-4299-9060-5b87ff3ba58e",
    "name": "개천절",
    "holiday": true,
    "date": "2018-10-03",
    "categoryId": "global",
    "times": []
  }, {
    "id": "24d6a540-9780-45c0-898f-4a1c644fc657",
    "name": null,
    "holiday": false,
    "date": "2018-10-04",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "01394b36-1e43-4230-a188-7640e59725cb",
    "name": null,
    "holiday": false,
    "date": "2018-10-05",
    "categoryId": "global",
    "times": [{"begin": "09:00:00", "end": "12:00:00"}, {"begin": "13:00:00", "end": "18:00:00"}]
  }, {
    "id": "ed218631-2fe4-4d69-96d3-c3df5c5e9afa",
    "name": null,
    "holiday": true,
    "date": "2018-10-06",
    "categoryId": "global",
    "times": []
  }, {
    "id": "5c1e2f6c-9cf2-4d98-a58e-1367bc018449",
    "name": null,
    "holiday": true,
    "date": "2018-10-07",
    "categoryId": "global",
    "times": []
  }]

  export default {
    props: {},
    data() {
      return {
        array: [
          {
            name: "포장 1",
            schedules: [
              {
                begin: moment('2018-09-03 09:00:00', 'YYYY-MM-DD HH:mm:ss').toDate(),
                end: moment('2018-09-07 18:00:00', 'YYYY-MM-DD HH:mm:ss').toDate()
              }
            ]
          }, {
            name: "포장 2",
            schedules: [
              {
                begin: moment('2018-09-03 09:00:00', 'YYYY-MM-DD HH:mm:ss').toDate(),
                end: moment('2018-09-07 17:00:00', 'YYYY-MM-DD HH:mm:ss').toDate()
              }
            ]
          }],
        weeks: [],
        workTimes: {},
        hide: false
      }
    },
    async mounted() {
      this.load()
    },
    methods: {
      load() {
        const weeks = []
        const dayTimes = {}
        workDays.forEach(day => {
          const date = moment(day.date, "YYYY-MM-DD")
          let week = weeks.find(w => w.value == date.week())
          if (!week) {
            week = {
              value: date.week(),
              label: date.format('YYYY MMM(w)'),
              days: []
            }
            weeks.push(week)
          }
          week.days.push({
            value: day.date,
            label: date.format('Do(ddd)'),
            width: 90
          })

          dayTimes[day.date] = day.times
          /*
          const hours = []
          day.times.forEach(time => {
            hours.push(moment(time.begin, 'HH:mm:ss').hour())
            hours.push(moment(time.end, 'HH:mm:ss').hour())
          })
          */
        })
        weeks.forEach(week => {
          week.width = week.days
          .map(d => d.width)
          .reduce((acc, cur) => acc + cur)
        })
        this.weeks = weeks
        this.dayTimes = dayTimes
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
      async refresh() {
        //const displayDate = moment().year(this.year).month(this.month - 1).toDate()
        //await this.retrieve(displayDate)
        //this.displayDate = displayDate
      },
      async onTimeSelectionChanged(event) {
        const model = event.api.getSelectedRows()[0]
        this.selected.workTime = await WorkDayModel.get(model.id, false)
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
    computed: {},

    watch: {},

    components: {
      'schedule-cell-renderer': ScheduleCellRenderer
    }
  }
</script>
<style lang="stylus">
  .ag-grid-scheduler
    .ag-cell
      padding-left: 0px
      padding-right: 0px
</style>