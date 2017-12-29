<template>
  <div hidden>
    <slot></slot>
  </div>
</template>

<script>
  import {ColDefUtil} from 'ag-grid';
  import * as _ from 'lodash';

  const watchedProperties = {};
  const props = ['cellRenderer'];

  ColDefUtil.ALL_PROPERTIES.forEach((propertyName) => {
    props.push(propertyName);

    watchedProperties[propertyName] = function (val, oldVal) {
      this.processChanges(propertyName, val, oldVal);
    };
  });

  export default {
    name: 'ag-grid-column',
    props: props,
    data() {
      return {
        _initialised: false,
        _grid: null
      };
    },
    methods: {
      processChanges(propertyName, val, oldVal) {
        if (this._initialised) {
          this._grid.invalidateColumnDefinitions();
        }
      },
      getChildren() {
        return (this.$slots.default || []).filter(
            (c) => c.componentInstance && c.componentInstance.getColumnDefinition);
      },
      getColumnDefinition() {
        let colDef = _.assign({}, this.$props);
        colDef.children = this.getChildren().map(
            (column) => column.componentInstance.getColumnDefinition());
        if (!colDef.children.length) {
          delete colDef.children;
        }
        return colDef;
      },
      setGrid(grid) {
        this._grid = grid;
        this.getChildren().forEach((column) => column.componentInstance.setGrid(grid));
      }
    },
    watch: watchedProperties,
    mounted() {
      this._initialised = true;
    },
    destroyed() {
    }
  };
</script>

<style>
</style>
