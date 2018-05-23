import { Notify } from 'quasar'
import VueClipboard from 'vue-clipboard2'

const clipboardSuccess = (event) => {
  Notify.create({
    icon: 'info',
    position: 'top-right',
    color: 'info',
    timeout: 3000,
    message: '클립보드에 값이 복사 되었습니다'
  })
}

const clipboardError = (event) => {
  Notify.create({
    icon: 'error',
    position: 'top-right',
    color: 'error',
    timeout: 3000,
    message: '클립보드 값 복사에 실패 했습니다'
  })
}

export default ({app, router, Vue}) => {
  Vue.use(VueClipboard)

  Vue.directive('clipboard-notify', {
    bind: function (el, binding, vnode) {
      setTimeout(() => {
        if (!el._v_clipboard_success) {
          el._v_clipboard_success = clipboardSuccess
        }
        if (!el._v_clipboard_error) {
          el._v_clipboard_error = clipboardError
        }
      }, 500)
    },
    unbind: function (el, binding) {
      delete el._v_clipboard_success
      delete el._v_clipboard_error
    }
  })
}
