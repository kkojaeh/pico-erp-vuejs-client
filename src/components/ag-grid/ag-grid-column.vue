<template>
  <div hidden data-ignored="">
    <slot></slot>
  </div>
</template>

<script>
  import {ColDefUtil} from 'ag-grid-community'
  import * as _ from 'lodash'
  import lzutf8 from 'lzutf8'

  let count = 0

  function createCellClassProxy(value) {
    return (params) => {
      let names = []
      let hasError = false;
      if (params.data.$errors) {
        let errors = _.get(params.data.$errors, params.colDef.field)
        if (errors && _.isString(errors)) {
          hasError = true
          names.push('ag-cell-error')
          const encoded = lzutf8.compress(errors, {
            outputEncoding: 'Base64'
          })
          names.push('ag-cell-encoded-errors-' + encoded)
        }
      }
      if(!hasError) {
        const editable = params.colDef.editable
        if (editable == true || (_.isFunction(editable) && editable(params))) {
          names.push('ag-cell-editable')
        }
      }
      if(_.isFunction(value)){
        let original = value(params)
        if(_.isArray(original)){
          _.union(names, original)
        }else{
          names.push(original)
        }
      }
      return names
    }
  }

  const predefined = {
    cellClass: {
      type: [String, Function]
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
  const props = {
    sortField: {
      type: String
    }
  }

  ColDefUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props[propertyName] = predefined[propertyName] || {}

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal)
    }
  })

  export default {
    name: 'ag-grid-column',
    props: props,
    data() {
      return {
        _initialised: false
      }
    },
    methods: {
      processChanges(propertyName, val, oldVal) {
        if (this._initialised) {
          if (propertyName == 'cellRendererParams' && this.cellRendererFramework
              == "ag-grid-router-link-renderer") {
            //console.log(propertyName, val, oldVal, _.isEqual(val, oldVal))
          }
          if (_.isEqual(val, oldVal)) {
            return
          }
          const revision = this.$el.getAttribute("__ag-grid-column_revision__")
          this.$el.setAttribute("__ag-grid-column_revision__", revision + 1)
        }
      },
      getChildren() {
        return (this.$slots.default || []).filter(
            (c) => c.componentInstance && c.componentInstance.getColumnDefinition)
      },
      getColumnDefinition() {
        let colDef = _.assign({}, this.$props)
        colDef.cellClass = createCellClassProxy(colDef.cellClass)
        colDef.children = this.getChildren().map(
            (column) => column.componentInstance.getColumnDefinition())
        if (!colDef.children.length) {
          delete colDef.children
        }
        return colDef
      }
    },
    watch: watchedProperties,
    mounted() {
      this._initialised = true
      this.$el.setAttribute("__ag-grid-column_revision__", 1)
    },
    destroyed() {
    }
  }
</script>

<style>
</style>
