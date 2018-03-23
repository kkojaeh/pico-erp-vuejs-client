import { Dialog, Notify } from 'quasar'

async function confirm (message, detail) {
  try {
    await Dialog.create({
      title: '확인',
      message,
      detail,
      ok: true,
      cancel: true
    })
    return true
  } catch (e) {
    return false
  }
}

function positive (message, detail) {
  let alert = Notify.create({
    icon: 'done',
    position: 'bottom-right',
    color: 'positive',
    message,
    detail
  })
  setTimeout(alert.dismiss, 4000)
}

function negative (message, detail) {
  let alert = Notify.create({
    icon: 'error',
    position: 'bottom-right',
    color: 'negative',
    message,
    detail
  })
  setTimeout(alert.dismiss, 4000)
}

function warning (message, detail) {
  let alert = Notify.create({
    icon: 'warning',
    position: 'bottom-right',
    color: 'warning',
    message,
    detail
  })
  setTimeout(alert.dismiss, 4000)
}

function info (message, detail) {
  let alert = Notify.create({
    icon: 'info',
    position: 'bottom-right',
    color: 'info',
    message,
    detail
  })
  setTimeout(alert.dismiss, 4000)
}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.prototype.$alert = {
    confirm,
    positive,
    negative,
    warning,
    info
  }
  // something to do
}
