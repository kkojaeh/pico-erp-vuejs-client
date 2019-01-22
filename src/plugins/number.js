// import something here
import Converter from 'number-to-text/lib/Converter'

import enUsConverter from 'number-to-text/converters/en-us'
import {language, languageAliases} from 'src/i18n'
import koKrConverter from './number/ko-kr-converter'

// 참조 하지 않으면 해당 소스가 바벨로 처리되지 않음
Converter

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

