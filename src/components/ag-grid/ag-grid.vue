<template>
  <div class="row ag-grid-wrapper">
    <div ref="position" :class="wrapperClasses" class="col-grow"></div>
    <slot></slot>
  </div>
</template>

<script>
  import { ComponentUtil, Grid } from 'ag-grid'
  import { VueFrameworkFactory } from './vue-framework-factory'
  import { VueFrameworkComponentWrapper } from './vue-framework-component-wrapper'
  import * as _ from 'lodash'
  import i18n from 'src/i18n/ag-grid'

  let count = 0

  const predefined = {}
  const watchedProperties = {}
  const props = {
    theme: {
      validator: (value) => ['material', 'balham'].includes(value),
      default: 'material'
    },
    autoSizeColumnsToFit: {
      type: Boolean,
      default: false
    }
  }
  ComponentUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props[propertyName] = predefined[propertyName] || {}

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal)
    }

  })

  export default {
    name: 'ag-grid',
    props: props,
    data () {
      return {
        isAgGrid: true,
        _initialised: false,
        _destroyed: false,
        _editing: false,
        _invalidateColumnDefinitionsQueued: false,
        _keyActingCell: null
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
        if (this._editing) {
          this._invalidateColumnDefinitionsQueued = true
          return
        }
        if (this.api) {
          this.api.setColumnDefs(
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
      },

      onGridSizeChanged (event) {
        if (this.autoSizeColumnsToFit) {
          this.api.sizeColumnsToFit()
        }
      },
      onGridNewColumnsLoaded (event) {
        if (this.autoSizeColumnsToFit) {
          this.api.sizeColumnsToFit()
        }
      },
      onGridCellEditingStarted (event) {
        this._editing = true
      },
      onGridCellEditingStopped (event) {
        this._editing = false
        if (this._invalidateColumnDefinitionsQueued) {
          this._invalidateColumnDefinitionsQueued = false
          this.invalidateColumnDefinitions()
        }
      },
      onWindowCopy (e) {
        const cell = this._keyActingCell
        e.clipboardData.setData('text/plain', cell.innerText)
        e.preventDefault()
      },
      onWindowKeydowned (event) {
        if (this._keyActingCell) {
          return
        }
        const target = event.target
        const el = this.$el
        const containsCell = target.className.indexOf(' ag-cell ') && el.contains(target)
        if (!containsCell) {
          return
        }
        this._keyActingCell = target
        window.addEventListener('copy', this.onWindowCopy)
      },
      onWindowKeyuped (event) {
        if (!this._keyActingCell) {
          return
        }
        this._keyActingCell = null
        window.removeEventListener('copy', this.onWindowCopy)
      }
    },
    created () {
      this.invalidateColumnDefinitions = _.debounce(this.invalidateColumnDefinitions, 500)
      this.onGridSizeChanged = _.debounce(this.onGridSizeChanged, 200)
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
      this._gridParams = {
        globalEventListener: this.globalEventListener.bind(this),
        frameworkFactory: vueFrameworkFactory,
        seedBeanInstances: {
          frameworkComponentWrapper: frameworkComponentWrapper
        }
      }
      gridOptions.localeText = i18n
      new Grid(this.$refs.position, gridOptions, this._gridParams)
      this._initialised = true
      this.$on('grid-size-changed', this.onGridSizeChanged)
      this.$on('new-columns-loaded', this.onGridNewColumnsLoaded)
      this.$on('cell-editing-started', this.onGridCellEditingStarted)
      this.$on('cell-editing-stopped', this.onGridCellEditingStopped)
      window.addEventListener('keydown', this.onWindowKeydowned)
      window.addEventListener('keyup', this.onWindowKeyuped)
    },
    watch: watchedProperties,
    computed: {
      api () {
        if (this.gridOptions) {
          return this.gridOptions.api
        }
      },
      columnApi () {
        return this.gridOptions.columnApi
      },
      wrapperClasses () {
        const classes = []
        classes.push(`ag-theme-${this.theme}`)
        return classes
      }
    },
    destroyed () {
      if (this._initialised) {
        this.gridOptions.api.destroy()
        this.gridOptions = null
        this._gridParams = null
        this._destroyed = true
        window.removeEventListener('keydown', this.onWindowKeydowned)
        window.removeEventListener('keyup', this.onWindowKeyuped)
      }
    }
  }
</script>

<style lang="stylus">
  .ag-grid-wrapper
    overflow: auto

  .ag-theme-material
    .ag-cell
      font-size: 12px
      padding-left: 8px
      padding-right: 8px
    .ag-cell:not(.ag-cell-focus)
      border-right: dotted 1px #e0e0e0
    .ag-header-cell
      padding-right: 5px
      font-size: 11px
    .ag-cell-editable::before
      position: absolute
      top: 0px
      left: 0px
      border-left: 5px solid darkseagreen
      border-top: 5px solid darkseagreen
      border-right: 5px solid transparent
      border-bottom: 5px solid transparent
      content: ""
    .ag-cell-inline-editing
      padding: 8px
      height: 100%
      input[type="text"], input[type="text"]:focus, input[type="tel"], input[type="tel"]:focus, input[type="date"], input[type="date"]:focus, input[type="datetime-local"], input[type="datetime-local"]:focus
        border: none
        padding-bottom: inherit

  /*
  .ag-grid-wrapper
    position: relative
    min-height: 300px
    > *
      position: absolute
      top: 0px
      bottom: 0px
      left: 0px
      right: 0px
  */
  /*
  for n in (1..20)
    .ag-theme-material .ag-ltr .ag-row-group-indent-{n}
      padding-left: n * 30 px
  */
</style>
