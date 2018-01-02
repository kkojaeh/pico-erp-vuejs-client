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
      :focused="focused"

      :length="length"
  >

    <input type="tel" ref="input" @input="_onInput"
           class="col q-input-target"
           :class="[`text-${align}`]"
           :disabled="disable"
           :readonly="readonly"
           :maxlength="maxLength"
           :placeholder="placeholder"
           @focus="__onFocus"
           @blur="__onInputBlur"/>
    <q-icon
        v-if="editable && clearable && length"
        slot="after"
        name="cancel"
        class="q-if-control"
        @click="clear"
    ></q-icon>
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
      },
      clearable: Boolean
    },
    data() {
      return {
        cleave: null,
        model: this.value,
        focused: false
      };
    },
    computed: {
      length() {
        return this.model !== null && this.model !== undefined
            ? ('' + this.model).length
            : 0;
      },
      editable() {
        return !this.disable && !this.readonly;
      }
    },
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
      },
      __onFocus(e) {
        clearTimeout(this.timer);
        this.focused = true;
        this.$emit('focus', e);
      },
      __onInputBlur(e) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.__onBlur(e)
        }, 200);
      },
      __onBlur(e) {
        this.focused = false;
        this.$emit('blur', e);
      },

      clear() {
        clearTimeout(this.timer);
        this.focus();
        if (this.editable) {
          this.model = this.isNumber ? null : '';
          this.cleave.setRawValue(this.model);
          this.$emit('input', this.model);
        }
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