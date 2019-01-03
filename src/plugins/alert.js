import {Dialog, Notify} from 'quasar'

async function confirm(message, detail) {
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

function positive(message, detail) {
  Notify.create({
    icon: 'done',
    position: 'top-right',
    color: 'positive',
    timeout: 3000,
    message,
    detail
  })
}

function negative(message, detail) {
  Notify.create({
    icon: 'error',
    position: 'top-right',
    color: 'negative',
    timeout: 3000,
    message,
    detail
  })
}

function warning(message, detail) {
  Notify.create({
    icon: 'warning',
    position: 'top-right',
    color: 'warning',
    timeout: 3000,
    message,
    detail
  })
}

function info(message, detail) {
  Notify.create({
    icon: 'info',
    position: 'top-right',
    color: 'info',
    timeout: 3000,
    message,
    detail
  })
}

async function prompt(message, type = "text", defaultValue = "") {
  try {
    const result = await Dialog.create({
      title: '확인',
      message,
      prompt: {
        model: defaultValue,
        type: type
      },
      ok: true,
      cancel: true
    })
    return result
  } catch (e) {
    return null
  }
}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.prototype.$alert = {
    confirm,
    positive,
    negative,
    warning,
    info,
    prompt
  }
  // something to do
}
