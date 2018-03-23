<template>
  <div>{{value()}}</div>
</template>

<script>
  import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';

  let phoneNumberUtil = PhoneNumberUtil.getInstance();

  export default {
    name: 'ag-grid-phone-number-renderer',
    methods: {
      value() {
        let value = this.params.value;
        if (value) {
          try {
            const parsed = phoneNumberUtil.parse(value);
            if (phoneNumberUtil.isValidNumber(parsed)) {
              return phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL);
            }
          } catch (e) {
          }
        } else {
          return null;
        }
      }
    }
  };
</script>
