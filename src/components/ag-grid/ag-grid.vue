<template>
  <div class="ag-grid-wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import { Grid, ComponentUtil } from 'ag-grid'
  import { VueFrameworkFactory } from './vue-framework-factory'
  import { VueFrameworkComponentWrapper } from './vue-framework-component-wrapper'
  import * as _ from 'lodash'
  import i18n from 'src/i18n/ag-grid'

  const watchedProperties = {}
  const props = []
  ComponentUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props.push(propertyName)

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal)
    }

  })
  ComponentUtil.EVENTS.forEach((eventName) => {
    props.push(eventName)
  })

  export default {
    name: 'ag-grid',
    props: props,
    data () {
      return {
        isAgGrid: true,
        _initialised: false,
        _destroyed: false
      }
    },
    methods: {
      globalEventListener (eventType, event) {
        if (this._destroyed) {
          return
        }
        let kebabCaseEventType = _.kebabCase(eventType)
        if (this.$listeners[kebabCaseEventType] || this._events[kebabCaseEventType]) {
          this.$emit(kebabCaseEventType, event)
        }
      },
      processChanges (propertyName, val, oldVal) {
        if (this._initialised) {
          let changes = {}
          changes[propertyName] = {currentValue: val, previousValue: oldVal}
          ComponentUtil.processOnChange(changes, this.gridOptions, this.gridOptions.api,
            this.gridOptions.columnApi)
        }
      },

      invalidateColumnDefinitions () {
        if (this.gridOptions.api) {
          this.gridOptions.api.setColumnDefs(
            this.$slots.default
            .filter(
              (column) => column.componentInstance
                && column.componentInstance.getColumnDefinition)
            .map((column) => column.componentInstance.getColumnDefinition())
          )
        }
      },

      getColumns () {
        return (this.$slots.default || [])
        .filter((c) => c.componentInstance && c.componentInstance.getColumnDefinition)
      }

    },
    created () {
      this.invalidateColumnDefinitions = _.debounce(this.invalidateColumnDefinitions, 500)
    },
    mounted () {
      this.gridOptions = {}
      let frameworkComponentWrapper = new VueFrameworkComponentWrapper(this)
      let vueFrameworkFactory = new VueFrameworkFactory(this.$el, this)
      let gridOptions = ComponentUtil.copyAttributesToGridOptions(this.gridOptions, this)

      gridOptions.columnDefs = this.getColumns().map((column) => {
        column.componentInstance.setGrid(this)
        return column.componentInstance.getColumnDefinition()
      })
      let gridParams = {
        globalEventListener: this.globalEventListener.bind(this),
        frameworkFactory: vueFrameworkFactory,
        seedBeanInstances: {
          frameworkComponentWrapper: frameworkComponentWrapper
        }
      }
      gridOptions.localeText = i18n
      new Grid(this.$el, gridOptions, gridParams)
      this._initialised = true
    },
    watch: watchedProperties,
    destroyed () {
      if (this._initialised) {
        this.gridOptions.api.destroy()
        this.gridOptions = null
        this._destroyed = true
      }
    }
  }
</script>

<style>
  .ag-grid-wrapper {
    position: relative;
  }

  .ag-grid-wrapper > * {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
</style>
