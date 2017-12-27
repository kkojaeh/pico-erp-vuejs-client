<template>
  <q-chip v-show="printValue" :closable="!immutable" color="primary" small detail square
          @close="_onClose">
    <div class="q-toolbar-subtitle">{{label}}</div>
    {{prefix}} {{printValue}} {{suffix}}
  </q-chip>
</template>

<script>
  import {date} from 'quasar';

  const iso8601RegExp = /^(\d{4})-(\d\d)-(\d\d)([T ](\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:(\d\d))?)?)?$/;
  const booleanRegExp = /^(true|false)$/;

  export default {
    name: 'c-filter-chip',
    props: {
      value: null,
      label: {
        required: true
      },
      prefix: '',
      suffix: '',
      immutable: {
        type: Boolean,
        default: false
      },
      adjustTime: {
        type: String,
        validator: (v) => ['first', 'last'].includes(v)
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      boolean: {
        type: Boolean,
        default: false
      },
      date: {
        type: Boolean,
        default: false
      },
      trueLabel: {
        type: String
      },
      falseLabel: {
        type: String
      }
    },
    data() {
      return {
        printValue: ''
      };
    },
    computed: {
      adjustTimeResolver() {
        let map = {
          'first': this.adjustTimeToFirst,
          'last': this.adjustTimeToLast
        };
        return map[this.adjustTime];
      }
    },

    methods: {
      _onClose() {
        this.$emit('input', null);
        this.$emit('remove');
      },
      resolveForSpecialValue(value) {
        if (typeof value === 'string') {
          if (this.date && iso8601RegExp.test(value)) {
            let parsedDate = this.adjustDate(new Date(Date.parse(value)));
            this.$emit('input', parsedDate.toISOString());
            return parsedDate;
          } else if (this.boolean && booleanRegExp.test(value)) {
            let bool = value === 'true';
            this.$emit('input', bool);
            return bool;
          }
        }
        return value;
      },

      adjustTimeToLast(value) {
        return date.adjustDate(value, {
          hours: 23,
          minutes: 59,
          seconds: 59,
          milliseconds: 999
        });
      },

      adjustTimeToFirst(value) {
        return date.adjustDate(value, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        });
      },

      adjustDate(value) {
        if (this.adjustTimeResolver) {
          return this.adjustTimeResolver(value);
        }
        return value;
      },

      print(value) {
        if (value instanceof Date) {
          return date.formatDate(value, this.dateFormat);
        }
        if (typeof value === 'boolean') {
          return value === true ? this.trueLabel : this.falseLabel;
        }
        return value;
      }
    },

    watch: {
      value(to, from) {
        this.printValue = this.print(this.resolveForSpecialValue(to));
      }
    },
    mounted() {
      this.printValue = this.print(this.resolveForSpecialValue(this.value));
    },
    destroyed() {

    }
  };
</script>

<style>
</style>
