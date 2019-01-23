<template>
  <div class="row ag-grid-wrapper">
    <div ref="position" :class="wrapperClasses" class="col-grow"></div>
    <div hidden ref="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {ComponentUtil, Grid} from 'ag-grid-community'
  import {VueFrameworkFactory} from './vue-framework-factory'
  import {VueFrameworkComponentWrapper} from './vue-framework-component-wrapper'
  import * as _ from 'lodash'
  import i18n from 'src/i18n/ag-grid'
  import lzutf8 from 'lzutf8'
  import Tooltip from 'tooltip.js'

  const predefined = {
    stopEditingWhenGridLosesFocus: {
      type: Boolean,
      default: false
    },
    gridAutoHeight: {
      type: Boolean,
      default: false
    }
  }
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
    data() {
      return {
        isAgGrid: true,
        _initialised: false,
        _destroyed: false,
        _editing: false,
        _invalidateColumnDefinitionsQueued: false,
        _keyActingCell: null,
        visibleHorizontalScrollLeft: false,
        visibleHorizontalScrollRight: false
      }
    },
    methods: {
      globalEventListener(eventType, event) {
        if (this._destroyed) {
          return
        }
        let kebabCaseEventType = _.kebabCase(eventType)
        if (this.$listeners[kebabCaseEventType] || this._events[kebabCaseEventType]) {
          this.$emit(kebabCaseEventType, event)
        }
      },
      processChanges(propertyName, val, oldVal) {
        if (this._initialised) {
          let changes = {}
          changes[propertyName] = {currentValue: val, previousValue: oldVal}
          ComponentUtil.processOnChange(changes, this.gridOptions, this.gridOptions.api,
              this.gridOptions.columnApi)
        }
      },

      invalidateColumnDefinitions() {
        if (this._editing) {
          this._invalidateColumnDefinitionsQueued = true
          return
        }
        if (this.api) {
          const focused = this.api.getFocusedCell()
          this.api.setColumnDefs(
              this.$slots.default
              .filter(
                  (column) => column.componentInstance
                      && column.componentInstance.getColumnDefinition)
              .map((column) => column.componentInstance.getColumnDefinition())
          )
          if (focused) {
            this.api.focusedCellController.setFocusedCell(focused.rowIndex,
                focused.column.getColId(), focused.floating, false)
          }
        }
      },

      sizeColumnsToFit() {
        if (this.autoSizeColumnsToFit && (this.$el.clientHeight + this.$el.clientWidth > 0)) {
          this.api.sizeColumnsToFit()
        }
      },

      getColumns() {
        return (this.$slots.default || [])
        .filter((c) => c.componentInstance && c.componentInstance.getColumnDefinition)
      },

      onGridSizeChanged(event) {
        this.sizeColumnsToFit()
      },
      onGridNewColumnsLoaded(event) {
        this.sizeColumnsToFit()
      },
      onGridCellEditingStarted(event) {
        this._editing = true
        if (this._tooltip) {
          this._tooltip.dispose()
          this._tooltip = null
        }
      },
      onGridCellEditingStopped(event) {
        this._editing = false
        if (this._invalidateColumnDefinitionsQueued) {
          this._invalidateColumnDefinitionsQueued = false
          this.invalidateColumnDefinitions()
        }
      },
      onGridCellMouseOver(event) {
        let dom = event.event.target
        if (dom.getAttribute('role') !== 'gridcell') {
          return
        }

        let errors = false,
            classList = dom.classList

        for (let i = 0; i < classList.length; i++) {
          let cls = classList[i]
          if (cls.startsWith('ag-cell-encoded-errors-')) {
            const encoded = cls.substr('ag-cell-encoded-errors-'.length)
            errors = lzutf8.decompress(encoded, {
              inputEncoding: 'Base64'
            })
            break
          }
        }

        if (errors) {
          if (this._tooltip) {
            this._tooltip.dispose()
            this._tooltip = null
          }
          errors = errors.split('\n').map(error => `<li>${error}</li>`).join('')
          this._tooltip = new Tooltip(dom, {
            title: `<ul>${errors}</ul>`,
            placement: 'bottom',
            offset: -200,
            html: true,
            container: this.$el,
            trigger: 'manual'
          })
          this._tooltip.show()
        }
      },
      onGridCellMouseOut(event) {
        const dom = event.event.target
        const related = event.event.relatedTarget
        if (dom.getAttribute('role') !== 'gridcell') {
          return
        }
        if (related && related.closest('.ag-cell-error')) {
          return
        }
        if (this._tooltip) {
          this._tooltip.dispose()
          this._tooltip = null
        }
      },
      onWindowCopy(e) {
        const cell = this._keyActingCell
        e.clipboardData.setData('text/plain', cell.innerText)
        e.preventDefault()
      },
      onWindowKeydowned(event) {
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
      onWindowKeyuped(event) {
        if (!this._keyActingCell) {
          return
        }
        this._keyActingCell = null
        window.removeEventListener('copy', this.onWindowCopy)
      }

    }
    ,
    created() {
      this.invalidateColumnDefinitions = _.debounce(this.invalidateColumnDefinitions, 500)
      this.sizeColumnsToFit = _.debounce(this.sizeColumnsToFit, 200)
    }
    ,
    mounted() {
      this.gridOptions = {}
      let frameworkComponentWrapper = new VueFrameworkComponentWrapper(this)
      let vueFrameworkFactory = new VueFrameworkFactory(this.$el, this)
      let gridOptions = ComponentUtil.copyAttributesToGridOptions(this.gridOptions, this)
      gridOptions.columnDefs = this.getColumns().map((column) => {
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
      this.$on('cell-mouse-over', this.onGridCellMouseOver)
      this.$on('cell-mouse-out', this.onGridCellMouseOut)
      window.addEventListener('keydown', this.onWindowKeydowned)
      window.addEventListener('keyup', this.onWindowKeyuped)
      this.observer = new MutationObserver(this.invalidateColumnDefinitions)
      this.observer.observe(this.$refs.slot, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
      })
    },
    watch: watchedProperties,
    computed:
        {
          api() {
            if (this.gridOptions) {
              return this.gridOptions.api
            }
          }
          ,
          columnApi() {
            return this.gridOptions.columnApi
          }
          ,
          wrapperClasses() {
            const classes = []
            classes.push(`ag-theme-${this.theme}`)
            return classes
          }
        }
    ,
    destroyed() {
      if (this._initialised) {
        this.gridOptions.api.destroy()
        this.gridOptions = null
        this._gridParams = null
        this._destroyed = true
        window.removeEventListener('keydown', this.onWindowKeydowned)
        window.removeEventListener('keyup', this.onWindowKeyuped)
        if (this._tooltip) {
          this._tooltip.dispose()
          this._tooltip = null
        }
        this.observer.disconnect()
        this.observer = null
      }
    }
  }
</script>

<style lang="stylus">
  .ag-grid-wrapper
    overflow: auto
    .ag-body-container
      transform: translateZ(0)
    .tooltip
      z-index: 20000
      pointer-events: none
      position: absolute
      background: red
      color: white
      border-radius: 3px
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5)
      padding: 10px
      text-align: left
      .tooltip-arrow
        width: 0
        height: 0
        border-style: solid
        position: absolute
        margin: 5px
        border-color: red
      ul
        padding: 5px
        margin-top: 0px
        margin-bottom: 0px
        list-style-type: none

    .tooltip[x-placement^="top"]
      margin-bottom: 5px
      .tooltip-arrow
        border-width: 5px 5px 0 5px
        border-left-color: transparent
        border-right-color: transparent
        border-bottom-color: transparent
        bottom: -5px
        left: calc(50% - 5px)
        margin-top: 0
        margin-bottom: 0
    .tooltip[x-placement^="bottom"]
      margin-top: 5px
      .tooltip-arrow
        border-width: 0 5px 5px 5px
        border-left-color: transparent
        border-right-color: transparent
        border-top-color: transparent
        top: -5px
        left: calc(50% - 5px)
        margin-top: 0
        margin-bottom: 0
    .tooltip[x-placement^="right"]
      margin-left: 5px
      .tooltip-arrow
        border-width: 5px 5px 5px 0
        border-left-color: transparent
        border-top-color: transparent
        border-bottom-color: transparent
        left: -5px
        top: calc(50% - 5px)
        margin-left: 0
        margin-right: 0
    .tooltip[x-placement^="left"]
      margin-right: 5px
      .tooltip-arrow
        border-width: 5px 0 5px 5px
        border-top-color: transparent
        border-right-color: transparent
        border-bottom-color: transparent
        right: -5px
        top: calc(50% - 5px)
        margin-left: 0
        margin-right: 0

  .ag-theme-material
    .ag-cell
      font-size: 12px
      padding-left: 8px
      padding-right: 8px
    .ag-header-cell-resize
      right: -8px;
    .ag-cell:not(.ag-cell-focus)
      border-right: dotted 1px #e0e0e0
    .ag-header-group-cell
      border-right: dotted 1px #e0e0e0
    .ag-header-cell
      border-right: dotted 1px #e0e0e0
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
    .ag-cell-error::after
      position: absolute
      top: 0px
      left: 0px
      border-left: 5px solid red
      border-top: 5px solid red
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
