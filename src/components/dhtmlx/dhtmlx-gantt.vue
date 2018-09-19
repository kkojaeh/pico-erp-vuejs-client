<template>
  <div ref="gantt" class="dhtmlx-gantt-container">
  </div>
</template>

<script>
  import 'dhtmlx-gantt'
  import 'dhtmlx-gantt/codebase/locale/locale_kr'
  import * as _ from 'lodash'

  const initialConfig = _.cloneDeep(gantt.config)
  const initialTemplates = _.cloneDeep(gantt.templates)

  export default {
    name: 'dhtmlx-gantt',
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
      }
    },

    mounted() {
      _.forIn(initialConfig, (value, key) => gantt.config[key] = value)
      _.forIn(this.config, (value, key) => gantt.config[key] = value)
      _.forIn(initialTemplates, (value, key) => gantt.templates[key] = value)
      _.forIn(this.templates, (value, key) => gantt.templates[key] = value)
      gantt.init(this.$refs.gantt)
      gantt.parse(this.tasks)
    },

    destroyed() {
      //컴파일로 인한 재 초기화시 에러를 발생시켜 주석 처리
      //gantt.destructor()
    },

    computed: {
      gantt() {
        return gantt
      }
    }

  }
</script>

<style>
  @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>