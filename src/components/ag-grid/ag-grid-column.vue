<template>
  <div hidden data-ignored="">
    <slot></slot>
  </div>
</template>

<script>
  import { ColDefUtil } from 'ag-grid'
  import * as _ from 'lodash'

  let count = 0

  const predefined = {
    cellClass: {
      type: [String, Function],
      default: () => (params) => {
        const editable = params.colDef.editable
        if(editable == true || (_.isFunction(editable) && editable(params))){
          return 'ag-cell-editable'
        }
      }
    },
    editable: {
      type: [Boolean, Function]
    },
    colId: {
      type: String,
      default: () => {
        return 'col' + (++count)
      }
    },

  }
  const watchedProperties = {}
  const props = {}

  ColDefUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props[propertyName] = predefined[propertyName] || {}

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal)
    }
  })

  export default {
    name: 'ag-grid-column',
    props: props,
    data () {
      return {
        _initialised: false
      }
    },
    methods: {
      processChanges (propertyName, val, oldVal) {
        if (this._initialised) {
          if (!this._grid) {
            this.setGrid(this.findGrid())
          }
          this._grid.invalidateColumnDefinitions()

        }
      },
      getChildren () {
        return (this.$slots.default || []).filter(
          (c) => c.componentInstance && c.componentInstance.getColumnDefinition)
      },
      getColumnDefinition () {
        let colDef = _.assign({}, this.$props)
        colDef.children = this.getChildren().map(
          (column) => column.componentInstance.getColumnDefinition())
        if (!colDef.children.length) {
          delete colDef.children
        }
        return colDef
      },
      setGrid (grid) {
        this._grid = grid
        this.getChildren().forEach((column) => column.componentInstance.setGrid(grid))
      },
      findGrid () {
        let parent = this.$parent
        while (parent) {
          if (parent.isAgGrid) {
            break
          } else {
            parent = parent.$parent
          }
        }
        return parent
      }
    },
    watch: watchedProperties,
    mounted () {
      this._initialised = true
    },
    destroyed () {
      this._grid = null
    }
  }
</script>

<style>
</style>
