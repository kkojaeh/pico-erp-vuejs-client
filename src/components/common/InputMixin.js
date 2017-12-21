import {QIcon} from 'quasar';

const marginal = {
  type: Array,
  validator: (v) => v.every((i) => 'icon' in i)
};

const align = {
  left: 'start',
  center: 'center',
  right: 'end'
};

export default {
  components: {
    QIcon
  },
  props: {
    maxLength: [Number, String],
    placeholder: String,
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    warning: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    hideUnderline: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    align: {
      type: String,
      default: 'left',
      validator: (v) => ['left', 'center', 'right'].includes(v)
    }
  },
  computed: {
    labelIsAbove() {
      return this.focused || this.length || this.additionalLength
          || this.stackLabel;
    },
    alignClass() {
      return `justify-${align[this.align]}`;
    },
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
    focus() {
      if (!this.disable) {
        this.$refs.input.focus();
      }
    },
    __onClick(e) {
      this.focus();
      this.$emit('click', e);
    },
    __onFocus(e) {
      clearTimeout(this.timer);
      this.focused = true;
      this.$emit('focus', e);
    }
  }
};
