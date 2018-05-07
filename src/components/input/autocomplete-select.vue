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
    <v-select ref="input" v-model="model" :options="options"
              :label="labelField"
              :disabled="disable || readonly"
              :placeholder="placeholder"
              :clearable="false"
              class="col"
              @search="_onSelectSearch"
              @search:blur="__onBlur"
              @search:focus="__onFocus"
              :filterable="false">

      <template slot="option" slot-scope="option">
        <slot name="option" v-bind="option">
          {{getOptionLabel(option)}}
        </slot>
      </template>

      <template slot="no-options">데이터가 없습니다</template>

    </v-select>
    <q-icon
        v-if="editable && clearable && length"
        slot="after"
        name="cancel"
        class="q-if-control"
        @click.native="clear"
    ></q-icon>
  </q-input-frame>
</template>

<script>
  import VueSelect from 'vue-select'
  import InputMixin from './input-mixin'
  import * as _ from 'lodash'

  // Vue-Select 라벨 표시 기본 방법 변경
  VueSelect.props.getOptionLabel.default = function (option) {
    if (typeof option === 'object') {
      if (this.label) {

        return option[this.label]
      }
    }
    return option
  }

  export default {
    name: 'c-autocomplete-select',
    mixins: [InputMixin],
    components: {
      'v-select': VueSelect
    },
    props: {
      label: {
        type: String
      },
      labelField: {
        type: String
      },
      valueField: {
        type: String
      },
      value: {},
      options: {
        type: Array,
        default () {
          return []
        },
      },
      clearable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        model: {
          [this.valueField]: this.value,
          [this.labelField]: this.label
        },
        lastQueried: null,
        focused: false,
      }
    },
    computed: {
      length () {
        let value = this.model ? this.model[this.labelField] : null
        return value !== null && value !== undefined
          ? ('' + value).length
          : 0
      },
      editable () {
        return !this.disable && !this.readonly
      }
    },
    methods: {
      getOptionLabel (option) {
        if (typeof option === 'object') {
          if (this.labelField) {
            return option[this.labelField]
          }
        }
        return option
      },
      focus () {
        if (!this.disable) {
          this.$el.querySelector('input').focus()
        }
      },
      __onFocus (e) {
        clearTimeout(this.timer)
        this.focused = true
        this.$emit('focus', e)
      },
      __onBlur (e) {
        this.focused = false
        this.$emit('blur', e)
      },

      clear () {
        clearTimeout(this.timer)
        //this.focus()
        if (this.editable) {
          this.model = null
        }
      },

      _onSelectSearch (keyword, loading) {
        keyword = this.$el.querySelector('input').value
        if (this.lastQueried === keyword) {
          return
        }
        this.lastQueried = keyword
        loading(true)
        this.$emit('search', this.lastQueried, () => {
          loading(false)
        })
      }
    },
    watch: {
      model (to) {
        if (to) {
          this.$emit('input', to[this.valueField])
          this.$emit('update:label', to[this.labelField])
        } else {
          this.$emit('input', null)
          this.$emit('update:label', null)
        }
      },
      value (to) {
        if (to) {
          this.model = {
            [this.valueField]: to,
            [this.labelField]: this.label
          }
        } else {
          this.model = null
        }
      },
      label (to) {
        const value = this.value
        if (value) {
          this.model = {
            [this.valueField]: value,
            [this.labelField]: to
          }
        }
      }
    },
    mounted () {
      this._onSelectSearch = _.debounce(this._onSelectSearch, 300)
      // https://github.com/kkojaeh/pico-erp-vuejs-client/issues/6
      // 유니코드 형태의 문자는 바인딩이 글자가 완성시 되는 현상으로 입력에 따른 반응이 느려 추가함
      this.$el.querySelector('input').addEventListener('input', (event) => {
        this.$refs.input.search = event.target.value
      })
    },
    destroyed () {
      this.input = null
    }
  }
</script>