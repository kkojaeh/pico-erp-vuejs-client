// import something here

import numberToText from 'number-to-text'
import { language, languageAliases } from 'src/i18n'
import KoKrConverter from './number/ko-kr-converter'

const defaultLanguage = languageAliases({
  'en': 'en-us',
  'ko': 'ko-kr'
})[language]

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  numberToText.addConverter('ko-kr', new KoKrConverter())

  Vue.prototype.$number = {
    words: (number) => {
      return numberToText.convertToText(number, {
        language: defaultLanguage
      })
    }
  }
}

