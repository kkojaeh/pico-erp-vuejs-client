<template>
  <div hidden>
    <slot></slot>
  </div>
</template>

<script>
  import { ColDefUtil } from 'ag-grid'

  const watchedProperties = {}
  const props = []
  ColDefUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props.push(propertyName)

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal)
    }
  })

  export default {
    name: 'ag-grid-column',
    props: props,
    data () {
      return {
        _initialised: false,
        _grid: null
      }
    },
    methods: {
      processChanges (propertyName, val, oldVal) {
        if (this._initialised) {
          this._grid.invalidateColumnDefinitions()
        }
      },
      getColumnDefinition () {
        let colDef = Object.assign({}, this.$props)
        if (this.$slots.default) {
          colDef.children = this.$slots.default
            .filter(column => column.componentInstance && column.componentInstance.getColumnDefinition)
            .map(column => column.componentInstance.getColumnDefinition())
        }
        return colDef
      },
      setGrid (grid) {
        this._grid = grid
      }
    },
    watch: watchedProperties,
    mounted () {
      this._initialised = true
    },
    destroyed () {

    }
  }
</script>

<style>
</style>
