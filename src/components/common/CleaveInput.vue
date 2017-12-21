<template>
  <q-input-frame
      class="q-input"

      :prefix="prefix"
      :suffix="suffix"
      :stack-label="stackLabel"
      :float-label="floatLabel"
      :error="error"
      :warning="warning"
      :disable="disable"
      :inverted="inverted"
      :dark="dark"
      :hide-underline="hideUnderline"
      :before="before"
      :after="after"
      :color="color"

      :length="length"

      @click="__onClick"
      @focus="__onFocus"
  >

    <input type="tel" ref="input" @input="_onInput"
           class="col q-input-target"
           :class="[`text-${align}`]"
           :disabled="disable"
           :readonly="readonly"
           :maxlength="maxLength"
           :placeholder="placeholder"/>
  </q-input-frame>
</template>

<script>
  import InputMixin from './InputMixin';
  import Cleave from 'cleave.js';

  export default {
    name: 'c-cleave-input',
    mixins: [InputMixin],
    props: {
      value: {
        type: String
      },
      cleaveOptions: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        cleave: null,
        model: this.value
      };
    },
    computed: {},
    methods: {
      _initCleave() {
        if (this.cleave) {
          this.cleave.destroy();
        }
        this.cleave = new Cleave(this.$refs.input, this.cleaveOptions);
        this.cleave.setRawValue(this.model);
      },
      _onInput(e) {
        this.$nextTick(() => {
          this.model = this.cleave.getRawValue();
          this.$emit('input', this.model);
        });
      }
    },
    watch: {
      cleaveOptions: {
        handler(to, from) {
          this._initCleave();
        },
        deep: true
      },
      value(to) {
        this.model = to;
        this.cleave.setRawValue(this.model);
      }
    },
    mounted() {
      this._initCleave();
    },
    destroyed() {
      this.cleave.destroy();
      this.cleave = null;
    }
  };
</script>