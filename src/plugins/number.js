// import something here

import numberToText from 'number-to-text'
import { language, languageAliases } from 'src/i18n'
import SSF from 'ssf'

const baseNames = ['천', '백', '십', '']
const levelNames = ['', '만', '억', '조',
  '경', '해', '자', '양',
  '구', '간', '정', '재',
  '극', '항하사', '아승기', '나유타',
  '불가사의', '무량대수']
const decimals = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
const delimiterChar = ' '

export class KoKrConverter extends numberToText.Converter {
  convertToText (value, options) {
    if(value === undefined || value === null || value === ''){
      return ''
    }
    var result = ''
    value = String(value)

    var postFix = '', pointIndex = value.indexOf('.'),
      signIndex = value.indexOf('-')
    if (pointIndex > -1) {
      var fraction = value.substr(pointIndex + 1)
      value = value.substr(0, pointIndex)
      if (fraction) {
        postFix = ' (점) '
      }
      for (var i = 0; i < fraction.length; i++) {
        postFix += decimals[Number(fraction.charAt(i))]
      }
    }
    if (signIndex > -1) {
      value = value.substring(++signIndex, value.length)
      result = '(마이너스) '
    } else {
      result = ''
    }

    var length = value.length,
      level = parseInt(length / baseNames.length),
      start = 0,
      end = length % baseNames.length // 0, 1, 2, 3
    /* start validation */
    if (length > 69) {
      throw 'too long number : ' + value
    }
    if (isNaN(value)) {
      throw 'not a number form : ' + value
    }
    if (!isFinite(value)) {
      throw 'not finite : ' + value
    }
    /* end validation */

    if (end == 0) { // in case the length of num is => 0, 4, 8, 12, ...
      end = Math.min(length, baseNames.length)
      level--
    } else {
      for (var k = 0; k < baseNames.length - end; k++) {
        value = '0' + value
      }
      end = baseNames.length
    }

    while (start < length) {
      var partial = value.substring(start, end)
      var unitStr = ''

      for (var i = 0; i < partial.length; i++) {
        var ch = partial.charAt(i)
        if (ch != '0') {
          unitStr += decimals [parseInt(ch)] + baseNames[i]
        }
      }

      if (unitStr.length > 0) {
        result += unitStr + levelNames[level] + delimiterChar
      }
      level--
      start = end
      end += baseNames.length
    }
    if (result.length == 0) {
      result = decimals[0]
    }
    return result.trim() + postFix
  }
}

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

