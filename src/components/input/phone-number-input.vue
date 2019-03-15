<template>
  <div class="no-wrap row">
    <div>
      <q-popover v-model="selectorShowing">
        <q-list separator link>
          <q-item v-for="row in regions" :key="row.value"
                  @click.native="region = row.value" v-close-overlay>
            <q-item-side icon=" " :class="`flag-icon-${row.value}`"/>
            <q-item-main :label="row.label"/>
          </q-item>
        </q-list>
      </q-popover>
    </div>
    <c-cleave-input class="col-10" type="tel" v-model="model" ref="input"
                    :cleave-options="cleaveOptions" :stack-label="stackLabel"
                    :float-label="floatLabel" :disable="disable"
                    :hide-underline="hideUnderline"
                    :before="[{icon: ' ', class:`flag-icon-${region}`, disable:disable || readonly, handler: onSelect}]"
                    :readonly="readonly">
    </c-cleave-input>

  </div>
</template>

<script>
  import InputMixin from './input-mixin'
  import phoneRegions from './phone-regions.js'
  import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'
  import CCleaveInput from './cleave-input.vue'

  let phoneNumberUtil = PhoneNumberUtil.getInstance()

  export default {
    components: {CCleaveInput},
    name: 'c-phone-input',
    mixins: [InputMixin],
    props: {
      value: {
        type: String
      },
      defaultRegion: {
        type: String,
        default: 'KR'
      },
      availableRegions: {
        type: Array,
        default: () => ['KR', 'US']
      }
    },
    data() {
      let regions = (this.availableRegions || _.keys(phoneRegions)).map((region) => {
        region = region.toLowerCase()
        let info = phoneRegions[region]
        return {
          label: info.name,
          value: info.code.toUpperCase()
        }
      })
      return {
        cleaveOptions: {
          phone: true,
          delimiter: '-',
          phoneRegionCode: this.defaultRegion
        },
        region: this.defaultRegion,
        model: '',
        regions: regions,
        cleave: null,
        selectorShowing: false
      }
    },
    computed: {
      flag() {
        const region = this.regions.find(r => r.value == this.region) || {}
        return region.avatar
      }
    },
    methods: {
      async onSelect(e) {
        this.selectorShowing = true
      },
      _parseValue(value) {
        if (value) {
          try {
            const parsed = phoneNumberUtil.parse(value, this.region)
            if (phoneNumberUtil.isValidNumber(parsed)) {
              this.region = phoneNumberUtil.getRegionCodeForNumber(parsed)
              this.model = phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL)
            }
          } catch (e) {
          }
        } else {
          this.model = null
        }
      },
      focus() {
        this.$refs.input.focus()
      }
    },
    watch: {
      value(to) {
        this._parseValue(to)
      },
      model(to) {
        let value = to
        if (value) {
          try {
            const parsed = phoneNumberUtil.parse(value, this.region)
            if (phoneNumberUtil.isValidNumber(parsed)) {
              value = phoneNumberUtil.format(parsed, PhoneNumberFormat.E164)
            }
          } catch (e) {
          }
        }
        this.$emit('input', value)
      },
      region(to) {
        this.cleaveOptions.phoneRegionCode = to
      }
    },
    mounted() {
      this._parseValue(this.value)
    }
  }
</script>