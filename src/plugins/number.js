// import something here

import enUsConverter from 'number-to-text/converters/en-us'
import {language, languageAliases} from 'src/i18n'
import koKrConverter from './number/ko-kr-converter'

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
      return converters[defaultLanguage].convertToText(number, {})
    }
  }
}

