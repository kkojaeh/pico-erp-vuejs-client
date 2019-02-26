// import something here
import enUsConverter from 'number-to-words'
import {language, languageAliases} from 'src/i18n'
import koKrConverter from './number/ko-kr-converter'
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

const phoneNumberUtil = PhoneNumberUtil.getInstance()
const defaultLanguage = languageAliases({
  'en': 'en-us',
  'ko': 'ko-kr'
})[language]

const converters = {
  'en-us': enUsConverter,
  'ko-kr': koKrConverter
}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  Vue.prototype.$number = {
    words: (number) => {
      return converters[defaultLanguage].toWords(number)
    },
    phone: (value) => {
      if (value) {
        try {
          const parsed = phoneNumberUtil.parse(value)
          if (phoneNumberUtil.isValidNumber(parsed)) {
            return phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL)
          }
        } catch (e) {
        }
      } else {
        return null
      }
    }
  }

}

