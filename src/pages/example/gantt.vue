<template>
  <q-page class="column fit">
    <dhtmlx-gantt ref="gantt" class="col-grow" :tasks="tasks" :config="config"
                  :templates="templates"></dhtmlx-gantt>
  </q-page>
</template>

<script>
  import moment from 'moment'

  const resources = [{
    id: 'r-1',
  }]
  var weekScaleTemplate = function (date) {
    var dateToStr = gantt.date.date_to_str("%Y년 %M %d일");
    var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
    return dateToStr(date) + " - " + dateToStr(endDate);
  };

  export default {
    name: 'app',
    components: {},
    data() {
      return {
        templates: {
          scale_cell_class(date) {
            if (date.getDay() == 0) {
              return "sunday"
            }
            if (date.getDay() == 6) {
              return "saturday";
            }
          },
          task_cell_class(item, date) {
            if (date.getDay() == 0) {
              return "sunday"
            }
            if (date.getDay() == 6) {
              return "saturday";
            }
          }
        },
        config: {
          start_date: new Date(2019, 8, 1, 7, 0),
          end_date: new Date(2019, 8, 31, 7, 0),
          date_scale: "%l, %F %d",
          work_time: true,
          scale_unit: "day",
          duration_unit: "hour",
          min_column_width: 20,
          skip_off_time: true,
          /*

          date_grid: "%H:%i",
          scale_unit: "hour",
          duration_unit: "hour",
          date_scale: "%H:%i",
          details_on_create: true,
          */
          subscales: [
            //{unit: "day", step: 1, date: "%d"},
            //{unit: "month", step: 1, date: "%M"},
            //{unit: "year", step: 1, date: "%Y 년"}
            {unit: "week", step: 1, template: weekScaleTemplate},
            {unit: "hour", step: 1, date: "%G"}
          ],
          scale_height: 3 * 28
        },
        tasks: {
          data: [
            {id: 1, text: 'Task #1', start_date: '14-09-2018 08:00', duration: 3, progress: 0.6},
            {
              id: 2,
              text: 'Task #3',
              start_date: new Date(2019, 8, 13, 7, 0),
              duration: 2,
              progress: 0.4
            }
          ],
          links: [
            {id: 1, source: 1, target: 2, type: '0'}
          ]
        },
      }
    },
    mounted() {
      workDays.filter(day => day.categoryId == 'global')
      .filter(day => day.times.length > 0)
      .map(day => {
        const date = moment(day.date, "YYYY-MM-DD").toDate()
        const hours = []
        day.times.forEach(time => {
          hours.push(moment(time.begin, 'HH:mm:ss').hour())
          hours.push(moment(time.end, 'HH:mm:ss').hour())
        })
        return {date, hours}
      })
      .forEach(workDay => {
        this.$refs.gantt.gantt.setWorkTime(workDay)
      })
      this.$refs.gantt.gantt.ignore_time = function (date) {
        console.log('ignore_time')
        return !gantt.isWorkTime(date);
      }
      this.$refs.gantt.gantt.render()
    }
  }
</script>
<style lang="stylus">
  .dhtmlx-gantt-container
    .saturday
      background: #add8e6aa
    .sunday
      background: #ffb6c1aa
    .gantt_selected
      .sunday
        background: #f7eb91
</style>