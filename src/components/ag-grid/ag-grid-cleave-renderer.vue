<template>
  <div>{{value()}}</div>
</template>

<script>
  // import * as _ from 'lodash';
  import Cleave from 'cleave.js';

  export default {
    name: 'ag-grid-cleave-renderer',
    methods: {
      value() {
        let v = this.params.value;
        if (v) {
          let co = this.params.cleaveOptions;
          let blocksLength = co.blocks && co.blocks.length ? co.blocks.length : 0;
          return Cleave.Util.getFormattedValue(v, co.blocks, blocksLength, co.delimiter,
              co.delimiters || []);
        } else {
          return '';
        }
      }
    }
  };
</script>
