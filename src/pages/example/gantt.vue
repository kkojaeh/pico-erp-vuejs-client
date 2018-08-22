<template>
  <q-page class="column fit">
    <dhtmlx-gantt class="col-grow" :tasks="tasks" :config="config"
                  :templates="templates"></dhtmlx-gantt>
  </q-page>
</template>

<script>
  const resources = [{
    id: 'r-1',
  }]

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
          start_date: new Date(2017, 4, 12, 7, 0),
          end_date: new Date(2017, 4, 17, 7, 0),
          date_scale: "%d 일",
          /*

          date_grid: "%H:%i",
          scale_unit: "hour",
          duration_unit: "hour",
          date_scale: "%H:%i",
          details_on_create: true,
          */
          subscales: [
            //{unit: "day", step: 1, date: "%d"},
            {unit: "month", step: 1, date: "%M"},
            {unit: "year", step: 1, date: "%Y 년"}
          ],
          scale_height: 3 * 28
        },
        tasks: {
          data: [
            {id: 1, text: 'Task #1', start_date: '14-05-2017 08:00', duration: 3, progress: 0.6},
            {id: 2, text: 'Task #2', start_date: '15-05-2017 03:00', duration: 3, progress: 0.4},
            {
              id: 2,
              text: 'Task #3',
              start_date: new Date(2017, 4, 13, 7, 0),
              duration: 2,
              progress: 0.4
            }
          ],
          links: [
            {id: 1, source: 1, target: 2, type: '0'}
          ]
        },
      }
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