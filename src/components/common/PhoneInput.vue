<template>
  <div class="no-wrap row">
    <q-select v-model="region" :options="regions" filter class="col-2 no-padding" :disable="disable || readonly"
              :display-value="`<div class='iti-flag ${region.toLowerCase()}'></div>`"></q-select>
    <c-cleave-input class="col-10" type="tel" v-model="model"
                    :cleave-options="cleaveOptions" :stack-label="stackLabel" :float-label="floatLabel" :disable="disable"
                    :readonly="readonly"></c-cleave-input>
  </div>
</template>

<script>
  import InputMixin from './InputMixin';
  import phoneRegions from './PhoneRegions.js';
  import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
  import CCleaveInput from './CleaveInput.vue';

  let phoneNumberUtil = PhoneNumberUtil.getInstance();

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
        type: Array
      }
    },
    data() {
      let regions = (this.availableRegions || _.keys(phoneRegions)).map((region) => {
        let info = phoneRegions[region];
        return {
          label: info.name,
          stamp: `<div class="iti-flag ${info.code}"></div>`,
          value: info.code.toUpperCase()
        };
      });
      return {
        cleaveOptions: {
          phone: true,
          delimiter: '-',
          phoneRegionCode: this.defaultRegion
        },
        region: this.defaultRegion,
        model: '',
        regions: regions,
        cleave: null
      };
    },
    computed: {},
    methods: {
      _parseValue(value) {
        if (value) {
          try {
            const parsed = phoneNumberUtil.parse(value, this.region);
            if (phoneNumberUtil.isValidNumber(parsed)) {
              this.region = phoneNumberUtil.getRegionCodeForNumber(parsed);
              this.model = phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL);
            }
          } catch (e) {
          }
        } else {
          this.model = null;
        }
      },
      _onCleaveInput(input) {
        this.model = input;
      }
    },
    watch: {
      value(to) {
        this._parseValue(to);
      },
      model(to) {
        let value = to;
        if (value) {
          try {
            const parsed = phoneNumberUtil.parse(value, this.region);
            if (phoneNumberUtil.isValidNumber(parsed)) {
              value = phoneNumberUtil.format(parsed, PhoneNumberFormat.E164);
            }
          } catch (e) {
          }
        }
        this.$emit('input', value);
      },
      region(to) {
        this.cleaveOptions.phoneRegionCode = to;
      }
    },
    mounted() {
      this._parseValue(this.value);
    }
  };
</script>
<style scoped>
  @import '../../statics/phone/style.css';
</style>