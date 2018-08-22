/* eslint-disable */
import {language, languageAliases} from './index'
import validate from 'validate.js'

const exports = {}

exports.ko = () => {
  const keywords = {
    'greaterThan': '보다 커야',
    'greaterThanOrEqualTo': '보다 크거나 같아야',
    'lessThan': '보다 작아야',
    'lessThanOrEqualTo': '보다 작거나 같아야',
    'equalTo': '와 같아야',
    'divisibleBy': '로 나뉘어야'
  }
  validate.globalOptions = {
    fullMessages: false,
    prettify: (str) => {
      return keywords[str]
    }
  }
  validate.validators.datetime.notValid = '일자 형식이 아닙니다'
  validate.validators.datetime.tooEarly = 'must be no earlier than %{date}'
  validate.validators.datetime.tooLate = 'must be no later than %{date}'
  validate.validators.email.message = '이메일 양식이 아닙니다'
  validate.validators.equality.message = '동일하지 않습니다'
  validate.validators.exclusion.message = '^%{value} 는 제한됩니다'
  validate.validators.inclusion.message = '^%{value} 는 목록에 포함되지 않습니다'
  validate.validators.url.message = 'URL 형식이 아닙니다'
  validate.validators.presence.message = '필수 입력입니다'
  validate.validators.format.message = '형식이 틀립니다'
  validate.validators.length.notValid = '잘못된 길이 입니다'
  validate.validators.length.wrongLength = '잘못된 길이 입니다 (%{count} 글자)'
  validate.validators.length.tooShort = '길이가 너무 짧습니다 (최소 %{count} 자 이상)'
  validate.validators.length.tooLong = '길이가 너무 깁니다 (최대 %{count} 자 이하)'
  validate.validators.numericality.notValid = '숫자를 입력하세요'
  validate.validators.numericality.notInteger = '정수를 입력하세요'
  validate.validators.numericality.notGreaterThan = '%{count} %{type} 합니다'
  validate.validators.numericality.notGreaterThanOrEqualTo = '%{count} %{type} 합니다'
  validate.validators.numericality.notEqualTo = '%{count} %{type} 합니다'
  validate.validators.numericality.notLessThan = '%{count} %{type} 합니다'
  validate.validators.numericality.notLessThanOrEqualTo = '%{count} %{type} 합니다'
  validate.validators.numericality.notDivisibleBy = '%{count} %{type} 합니다'
  validate.validators.numericality.notOdd = '홀수가 되야 합니다'
  validate.validators.numericality.notEven = '짝수가 되야 합니다'
  validate.validators.exists.message = '이미 존재합니다'
  validate.validators.phoneNumber.message = '전화번호 형식이 아닙니다'
  validate.validators.date.tooEarly = '%{date} 이전 시간이 아닙니다'
  validate.validators.date.tooLate = '%{date} 이후 시간이 아닙니다'
  validate.validators.datetime.tooEarly = '%{date} 보다 이전 시간 입니다'
  validate.validators.datetime.tooLate = '%{date} 보다 이후 시간 입니다'
}

export default languageAliases(exports)[language]
