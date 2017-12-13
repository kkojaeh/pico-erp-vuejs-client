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

    watchedProperties[propertyName] = function (val, oldVal) {// eslint-disable-line
      this.processChanges(propertyName, val, oldVal);// eslint-disable-line
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
      getColumnDefinition() {
        let colDef = _.assign({}, this.$props);
        if (this.$slots.default) {
          colDef.children = this.$slots.default
          .filter(
              (column) => column.componentInstance && column.componentInstance.getColumnDefinition)
          .map((column) => column.componentInstance.getColumnDefinition());
        }
        return colDef;
      },
      setGrid(grid) {
        this._grid = grid;
        if (this.$slots.default) {
          this.$slots.default
          .filter(
              (column) => column.componentInstance && column.componentInstance.getColumnDefinition)
          .forEach((column) => column.componentInstance.setGrid(grid));
        }
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
