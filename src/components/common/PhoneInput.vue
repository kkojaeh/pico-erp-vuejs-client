<template>
  <div class="no-wrap row">
    <q-select v-model="region" :options="regions" filter class="col-2"
              :display-value="`<div class='iti-flag ${region.toLowerCase()}'></div>`"></q-select>
    <q-input ref="numberInput" type="tel" v-model="number" class="col-10"></q-input>
  </div>
</template>

<script>
  import phoneRegions from './PhoneRegions.js';
  import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
  import Cleave from 'cleave.js';
  import CleavePhoneI18n from 'cleave.js/dist/addons/cleave-phone.i18n.js';// eslint-disable-line
  // import * as _ from 'lodash';

  let phoneNumberUtil = PhoneNumberUtil.getInstance();

  export default {
    name: 'c-phone-input',
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
      },
      floatLabel: {
        type: String
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
        region: this.defaultRegion,
        number: '',
        regions: regions,
        cleave: null
      };
    },
    computed: {},
    methods: {
      _fromValue(value) {
        if (value) {
          const parsed = phoneNumberUtil.parse(value, this.region);
          this.region = phoneNumberUtil.getRegionCodeForNumber(parsed);
          // this.cleave.setRawValue(phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL));
          this.cleave.setRawValue(phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL));
        } else {
          this.region = this.defaultRegion;
          this.cleave.setRawValue('');
        }
      },

      _toValue() {
        let rawValue = this.cleave.getRawValue();
        if (rawValue) {
          try {
            const parsed = phoneNumberUtil.parse(rawValue, this.region);
            if (phoneNumberUtil.isValidNumber(parsed)) {
              this.$emit('input', phoneNumberUtil.format(parsed, PhoneNumberFormat.E164));
            }
          } catch (e) {
          }
        } else {
          this.$emit('input', null);
        }
      },

      _onNumberChange(e) {
        this._toValue();
      }
    },
    watch: {
      value(to) {
        this._fromValue(to);
      },
      region(to) {
        this.cleave.setPhoneRegionCode(to);
        this._toValue();
      }
    },
    mounted() {
      // quasar 에서 처리하는 이벤트 핸들링을 제거
      let input = this.$refs.numberInput.$el.querySelector('input');
      input.parentNode.innerHTML = input.parentNode.innerHTML + ' ';
      input = this.$refs.numberInput.$el.querySelector('input');
      this.cleave = new Cleave(input,
          {
            phone: true,
            phoneRegionCode: this.region
          });
      input.addEventListener('input', this._onNumberChange);
      this._fromValue(this.value);
    },
    destroyed() {
      this.cleave.destroy();
      this.cleave = null;
    }
  };
</script>
<style>
  @import '../../statics/phone/style.css';
</style>