/* eslint-disable */
// https://monterail.github.io/vuelidate/#sub-builtin-validators

var exports = {};

exports.ko = {
  required: '필수 입력입니다',
  minLength: '길이가 너무 짧습니다(최소 ${min}자 이상)',
  maxLength: '길이가 너무 깁니다(최대 ${max}자 이하)',
  email: '이메일 형식이 아닙니다',
  phoneNumber: '전화번호 형식이 아닙니다'
};

export default exports[navigator.language];
