import axios from 'axios'
import * as _ from 'lodash'
import { Loading, Notify } from 'quasar'
import { init } from './auth'

let apiVersion = 'v1'

let loadFunction = (config) => {
  // data 가 존재하지 않으면 Content-Type 이 삭제 되는 문제 수정
  config.data = config.data || {}
  config.url = _.template(config.url)(config.data)
  config.headers['X-Firebase-Auth'] = localStorage.getItem(
    'API_FIREBASE_TOKEN')

  config.headers['Accept'] = `application/vnd.acepk.${apiVersion}+json`
  config.headers['Content-Type'] = `application/vnd.acepk.${apiVersion}+json`
  Loading.show({
    delay: 100
  })
  return config
}
let finishFunction = (response) => {
  setTimeout(() => Loading.hide(), 500)
  return response
}

let statusHandlers = {
  '401': (error) => {
    let message = error.response.data.message.toLowerCase()
    if (message.indexOf('verify') > -1 && message.indexOf('token') > -1) {
      init().then(() => {
        let alert = Notify.create({
          icon: 'warning',
          position: 'bottom-right',
          message: '인증을 갱신하였습니다',
          detail: '다시 시도 하세요'
        })
        setTimeout(alert.dismiss, 3000)
      })
      return true
    }
  },
  '403': (error) => {
    // TODO: 인증여부에 따라 로그인 페이지로 이동?
    return
  }
}

let errorHandler = (error) => {
  let message = error.message
  let preventDefault
  if (error.response) {
    let statusHandler = statusHandlers[error.response.status]
    if (statusHandler) {
      preventDefault = !!statusHandler(error)
    }
    if (!preventDefault) {
      message = error.response.data.message
      if (_.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map(
          (e) => `${e.field} : ${e.defaultMessage}`).join('<br>')
      }
    }
  }
  if (!preventDefault) {
    let alert = Notify.create({
      icon: 'warning',
      position: 'bottom-right',
      message: `${message}`
    })
    setTimeout(alert.dismiss, 3000)
  }
}

let errorFunction = (error) => {
  Loading.hide()
  if (!error.config.preventDefault) {
    errorHandler(error)
  } else {
    error.resumePreventDefault = _.bind(errorHandler, null, error)
  }
  return Promise.reject(error)
}

const axiosApi = axios.create({
  baseURL: document.querySelector('meta[name=api-server-url]').content,
  withCredentials: true
})

axiosApi.interceptors.request.use(loadFunction)
axiosApi.interceptors.response.use(finishFunction, errorFunction)

export default ({Vue}) => {
  Vue.prototype.$api = axiosApi
}

export { axiosApi as api }
