<template>
  <div ref="scheduler" class="dhtmlx-scheduler-container dhx_cal_container">
    <div class="dhx_cal_navline">
      <div class="dhx_cal_prev_button">&nbsp;</div>
      <div class="dhx_cal_next_button">&nbsp;</div>
      <div class="dhx_cal_today_button"></div>
      <div class="dhx_cal_date"></div>
      <!--<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>
      <div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>
      <div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>-->
    </div>
    <div class="dhx_cal_header"></div>
    <div class="dhx_cal_data"></div>
  </div>
</template>

<script>
  import 'dhtmlx-scheduler'
  import './scheduler.locale_kr'
  import * as _ from 'lodash'

  const initialConfig = _.cloneDeep(scheduler.config)
  const initialTemplates = _.cloneDeep(scheduler.templates)

  console.log(initialTemplates)

  export default {
    name: 'dhtmlx-scheduler',
    props: {
      templates: {
        type: Object,
        default() {
          return {}
        }
      },
      config: {
        type: Object,
        default() {
          return {}
        }
      },
      tasks: {
        type: Object,
        default() {
          return {data: [], links: []}
        }
      },
      displayDate: {
        type: Date,
        default: () => new Date()
      }
    },

    mounted() {
      _.forIn(initialConfig, (value, key) => scheduler.config[key] = value)
      _.forIn(this.config, (value, key) => scheduler.config[key] = value)
      _.forIn(initialTemplates, (value, key) => scheduler.templates[key] = value)
      _.forIn(this.templates, (value, key) => scheduler.templates[key] = value)
      scheduler.init(this.$refs.scheduler, this.displayDate, 'month')
      this.eventKeys = {}
      this.eventKeys.onViewChange = scheduler.attachEvent("onViewChange", this.onViewChange);
      this.eventKeys.onEmptyClick = scheduler.attachEvent("onEmptyClick", this.onEmptyClick);
      //scheduler.parse(this.tasks)
    },

    destroyed() {
      //컴파일로 인한 재 초기화시 에러를 발생시켜 주석 처리
      //gantt.destructor()
      console.log(this.eventKeys.onViewChange)
      scheduler.detachEvent("onViewChange", this.eventKeys.onViewChange);
      scheduler.detachEvent("onEmptyClick", this.eventKeys.onEmptyClick);
    },

    watch: {
      'displayDate'() {
        scheduler.updateView(this.displayDate, 'month')
      }
    },

    methods: {
      onViewChange(newMode, newDate) {
        this.$emit('view-change', {newMode, newDate})
      },
      onEmptyClick(date, e) {
        this.$emit('empty-click', {date, e})
      }
    },

    computed: {
      scheduler() {
        return scheduler
      }
    }

  }
</script>

<style>
  @import '~dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
</style>