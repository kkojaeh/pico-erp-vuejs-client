import axios from 'axios'
import * as _ from 'lodash'
import { Loading, Notify } from 'quasar'
import { init } from './auth'
import store from 'src/store'
import {apiBaseUrl, apiContentType} from 'src/plugins/config'
import Vue from 'vue'

let apiRequests = 0

let loadFunction = (config) => {

  // data 가 존재하지 않으면 Content-Type 이 삭제 되는 문제 수정
  config.data = config.data || {}
  config.url = _.template(config.url)(config.data)
  config.headers['Cache-Control'] = 'max-age=0'

  config.headers[store.getters['auth/tokenHeaderName']] = store.getters['auth/token']

  config.headers['Accept'] = apiContentType
  config.headers['Content-Type'] = apiContentType
  if (apiRequests == 0) {
    Loading.show({
      delay: 0
    })
  }
  apiRequests++
  const url = config.url
  const qi = url.lastIndexOf('?')
  Vue.analytics.trackEvent('api-' + config.method,
    qi > -1 ? url.substr(0, qi) : url,
    qi > -1 ? url.substr(qi + 1) : null
    )
  return config
}

let completeFunction = () => {
  setTimeout(() => {
    apiRequests--
    if (apiRequests == 0) {
      Loading.hide()
    }
  }, 200)
}
let finishFunction = (response) => {
  completeFunction()
  return response
}

let statusHandlers = {
  '401': (error) => {
    let message = error.response.data.message.toLowerCase()
    if (message.indexOf('verify') > -1 && message.indexOf('token') > -1) {
      init().then(() => {
        Notify.create({
          icon: 'warning',
          position: 'top-right',
          message: '인증을 갱신하였습니다',
          timeout: 3000,
          detail: '다시 시도 하세요'
        })
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
  completeFunction()
  let messages = [error.message]
  let preventDefault
  if (error.response) {
    let statusHandler = statusHandlers[error.response.status]
    if (statusHandler) {
      preventDefault = !!statusHandler(error)
    }
    if (!preventDefault) {
      messages = [error.response.data.message]
      if (_.isArray(error.response.data.errors)) {
        messages = error.response.data.errors.map(
          (e) => `${e.field} : ${e.defaultMessage}`)
      }
    }
  }
  if (!preventDefault) {
    messages.forEach(message => {
      Notify.create({
        icon: 'warning',
        position: 'top-right',
        timeout: 3000,
        message: `${message}`
      })
    })
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
  baseURL: apiBaseUrl
})

axiosApi.interceptors.request.use(loadFunction)
axiosApi.interceptors.response.use(finishFunction, errorFunction)

export default ({Vue}) => {
  Vue.prototype.$api = axiosApi
}

export { axiosApi as api }
