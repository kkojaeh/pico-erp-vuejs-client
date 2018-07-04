<template>
  <div class="container" style="position:relative;">
    <img class="flag-display" :src="`statics/flags/${region.toLowerCase()}.svg`"></img>
    <div class="no-wrap row justify-between">
      <q-select v-model="region" :options="regions" filter
                class="col-1 no-padding"
                style="min-width:50px;" :disable="disable || readonly"
                :display-value="` `" :hide-underline="hideUnderline"></q-select>
      <c-cleave-input class="col-10" type="tel" v-model="model" ref="input"
                      :cleave-options="cleaveOptions" :stack-label="stackLabel"
                      :float-label="floatLabel" :disable="disable"
                      :hide-underline="hideUnderline"
                      :readonly="readonly"></c-cleave-input>
    </div>
  </div>
</template>

<script>
  import InputMixin from './input-mixin'
  import phoneRegions from './phone-regions.js'
  import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'
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
    data () {
      let regions = (this.availableRegions || _.keys(phoneRegions)).map((region) => {
        region = region.toLowerCase()
        let info = phoneRegions[region]
        return {
          label: info.name,
          avatar: `statics/flags/${info.code}.svg`,
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
        flagClass: this.defaultRegion.toLowerCase(),
        model: '',
        regions: regions,
        cleave: null
      }
    },
    computed: {},
    methods: {
      _parseValue (value) {
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
      value (to) {
        this._parseValue(to)
      },
      model (to) {
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
      region (to) {
        this.cleaveOptions.phoneRegionCode = to
        this.flagClass = to.toLowerCase()
      }
    },
    mounted () {
      this._parseValue(this.value)
    }
  }
</script>
<style scoped>
  .flag-display {
    bottom: 5px;
    position: absolute;
    width: 30px;

  }
</style>