import validate from 'validate.js'
import { PhoneNumberUtil } from 'google-libphonenumber'
import message from 'src/i18n/Validation.js'

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  const phoneNumberUtil = PhoneNumberUtil.getInstance()

  validate.validators.phoneNumber = function (value, options, key, attributes) {
    if (value === '' || value === undefined || value === null) {
      return
    }
    try {
      const parsed = phoneNumberUtil.parse(value, null)
      if (phoneNumberUtil.isValidNumber(parsed)) {
        return
      }
    } catch (e) {
    }
    return validate.validators.phoneNumber.message
  }

  validate.validators.exists = async function (value, options, key,
    attributes) {
    let result = await options
    if (result) {
      return validate.validators.exists.message
    }
  }

  validate.validators.function = function (value, options, key, attributes) {
    if (_.isArray(options)) {
      return options
    }
    return options
  }

  message()
}
