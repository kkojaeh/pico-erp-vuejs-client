<template>
  <div class="row justify-center schedule-cell-renderer">
    <div v-for="hour in hours" class="col scheduler-hour" :class="{'bg-primary': isScheduled(hour)}"
         :key="hour">&nbsp;
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    computed: {

      value() {
        const field = this.params.colDef.field
        const schedules = this.params.data.schedules
        schedules.forEach(schedule => {
          console.log(schedule)
        })
      },

      hours() {
        const field = this.params.colDef.field
        const hours = []
        const times = this.params.dayTimes[field]
        if (times && times.length) {
          times.forEach(time => {
            const end = moment(time.end, 'HH:mm:ss').hour()
            const begin = moment(time.begin, 'HH:mm:ss').hour()
            for (let hour = begin; hour <= end; hour++) {
              hours.push(hour)
            }
          })
        }
        return hours
      }
    },
    methods: {
      isScheduled(hour) {
        const field = this.params.colDef.field
        const schedules = this.params.data.schedules
        const date = moment(field, 'YYYY-MM-DD')
        date.hour(hour)
        const matched = schedules.find(schedule => {
          return date.isSameOrAfter(moment(schedule.begin)) && date.isSameOrBefore(
              moment(schedule.end))
        })
        return !!matched
      }
    }
  }
</script>
<style lang="stylus">
  .schedule-cell-renderer
    text-overflow: ellipsis
    overflow: hidden

</style>