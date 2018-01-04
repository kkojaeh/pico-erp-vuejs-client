/* eslint-disable */
import validate from 'validate.js';

var exports = {};

exports.ko = () => {
  validate.validators.datetime.notValid = '일자 형식이 아닙니다';
  validate.validators.datetime.tooEarly = 'must be no earlier than %{date}';
  validate.validators.datetime.tooLate = 'must be no later than %{date}';
  validate.validators.email.message = '이메일 양식이 아닙니다';
  validate.validators.equality.message = '동일하지 않습니다';
  validate.validators.exclusion.message = '^%{value} 는 제한됩니다';
  validate.validators.inclusion.message = '^%{value} 는 목록에 포함되지 않습니다';
  validate.validators.url.message = 'URL 형식이 아닙니다';
  validate.validators.presence.message = '필수 입력입니다';
  validate.validators.format.message = '형식이 틀립니다';
  validate.validators.length.notValid = '잘못된 길이 입니다';
  validate.validators.length.wrongLength = '잘못된 길이 입니다 (%{count} 글자)';
  validate.validators.length.tooShort = '길이가 너무 짧습니다 (최소 %{count} 자 이상)';
  validate.validators.length.tooLong = '길이가 너무 깁니다 (최대 %{count} 자 이하)';
  validate.validators.numericality.notValid = '숫자를 입력하세요';
  validate.validators.numericality.notInteger = '정수를 입력하세요';
  validate.validators.numericality.notGreaterThan = 'must be %{type} %{count}';
  validate.validators.numericality.notGreaterThanOrEqualTo = 'must be %{type} %{count}';
  validate.validators.numericality.notEqualTo = 'must be %{type} %{count}';
  validate.validators.numericality.notLessThan = 'must be %{type} %{count}';
  validate.validators.numericality.notLessThanOrEqualTo = 'must be %{type} %{count}';
  validate.validators.numericality.notDivisibleBy = 'must be %{type} %{count}';
  validate.validators.numericality.notOdd = 'must be odd';
  validate.validators.numericality.notEven = 'must be even';
  validate.validators.exists.message = '이미 존재합니다';
  validate.validators.phoneNumber.message = '전화번호 형식이 아닙니다';
};

export default exports[navigator.language];
