import {Loading, Notify} from 'quasar'
import layoutMustache from './layout.mustache'
import logo from 'src/assets/logo.png'
import {dateFormat, dateTimeFormat, formatDate} from 'src/plugins/date'
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'
import Hogan from 'hogan.js'
import SSF from 'ssf'

console.log(Hogan)

const phoneNumberUtil = PhoneNumberUtil.getInstance()

export class Printer {

  static print(title, html) {
    const width = (595) * window.devicePixelRatio
    const height = (842) * window.devicePixelRatio

    const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft
        : screen.left;
    const dualScreenTop = window.screenTop != undefined ? window.screenTop
        : screen.top;

    const left = (width / 2) + dualScreenLeft;
    const top = (height / 2) + dualScreenTop;

    const options = `width=${width},height=${height},top=${top},left=${left},toolbars=no,scrollbars=no,status=no,resizable=no`

    const w = window.open('', title, options);
    if (!w) {
      Notify.create({
        icon: 'error',
        position: 'top-right',
        message: '팝업 차단이 되어있습니다 차단 해제후 실행하세',
        timeout: 3000,
        detail: '다시 시도 하세요'
      })
    }
    w.document.writeln(layoutMustache({
      html: html,
      logo: logo,
      title: title
    }))
    w.document.addEventListener("DOMContentLoaded", function (event) {
      //setTimeout(() => w.close(), 4000)
      //w.print();
      //w.close();
    });
    w.document.close();
    w.focus();
  }

  static formatPhoneNumber() {
    return function (text) {
      const value = Hogan.compile(text).render(this);
      const parsed = phoneNumberUtil.parse(value)
      if (phoneNumberUtil.isValidNumber(parsed)) {
        return phoneNumberUtil.format(parsed, PhoneNumberFormat.NATIONAL)
      }
      return ''
    }
  }

  static formatDate() {
    return function (text) {
      const value = Hogan.compile(text).render(this);
      return formatDate(value, dateFormat)
    }

  }

  static formatDateTime() {
    return function (text) {
      const value = Hogan.compile(text).render(this);
      return formatDate(value, dateTimeFormat)
    }
  }

  static formatNumber(format) {
    return function () {
      return function (text) {
        const value = Hogan.compile(text).render(this);
        return SSF.format(format || 'General', Number(value))
      }
    }
  }

}
