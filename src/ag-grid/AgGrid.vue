<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import { Grid, ComponentUtil } from 'ag-grid'
  import { VueFrameworkFactory } from './vueFrameworkFactory'
  import { VueFrameworkComponentWrapper } from './vueFrameworkComponentWrapper'
  import { debounce } from 'quasar'
  import kebabCase from 'kebab-case'

  const watchedProperties = {}
  const props = ['gridOptions']
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
        _initialised: false,
        _destroyed: false
      }
    },
    methods: {
      globalEventListener (eventType, event) {
        if (this._destroyed) {
          return
        }
        let kebabCaseEventType = kebabCase(eventType)
        if (this.$listeners[kebabCaseEventType] || this._events[kebabCaseEventType]) {
          this.$emit(kebabCaseEventType, event)
        }
      },
      processChanges (propertyName, val, oldVal) {
        if (this._initialised) {
          let changes = {}
          changes[propertyName] = {currentValue: val, previousValue: oldVal}
          ComponentUtil.processOnChange(changes, this.gridOptions, this.gridOptions.api, this.gridOptions.columnApi)
        }
      },

      invalidateColumnDefinitions () {
        this.gridOptions.api.setColumnDefs(
          this.$slots.default
            .filter(column => column.componentInstance && column.componentInstance.getColumnDefinition)
            .map(column => column.componentInstance.getColumnDefinition())
        )
      }
    },
    created () {
      this.invalidateColumnDefinitions = debounce(this.invalidateColumnDefinitions, 500)
    },
    mounted () {
      let frameworkComponentWrapper = new VueFrameworkComponentWrapper(this)
      let vueFrameworkFactory = new VueFrameworkFactory(this.$el, this)
      let gridOptions = ComponentUtil.copyAttributesToGridOptions(this.gridOptions, this)

      gridOptions.columnDefs = this.$slots.default
        .filter(column => column.componentInstance && column.componentInstance.getColumnDefinition)
        .map(column => {
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
      console.log(gridOptions)
      new Grid(this.$el, gridOptions, gridParams)
      this._initialised = true
    },
    watch: watchedProperties,
    destroyed () {
      if (this._initialised) {
        this.gridOptions.api.destroy()
        this._destroyed = true
      }
    }
  }
</script>

<style>
</style>
