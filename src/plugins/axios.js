import axios from 'axios'
import * as _ from 'lodash'
import {Loading, Notify} from 'quasar'
import {init, signOut} from './auth'
import store from 'src/store'
import Router from 'src/router'
import Vue from 'vue'

const apiBaseUrl = document.querySelector('meta[name=api-base-url]').content
const apiContentType = document.querySelector(
  'meta[name=api-content-type]').content

let apiRequests = 0
let analyticsHandlerId
const analytics = {}

const loadingStarts = [function () {
  Loading.show({
    delay: 0
  })
}]
const loadingStops = [function () {
  Loading.hide()
}]

const configRequest = function (config) {
  // data 가 존재하지 않으면 Content-Type 이 삭제 되는 문제 수정
  config.data = config.data || {}
  config.url = _.template(config.url)(config.data)
  // response header cache-control 이 통하지 않아 제거
  //config.headers['Cache-Control'] = 'max-age=0'

  config.headers[store.getters['auth/tokenHeaderName']] = store.getters['auth/token']
  config.headers['Accept'] = apiContentType
  config.headers['Content-Type'] = apiContentType
  return config
}

const loadingRequest = function (config) {
  if (apiRequests == 0) {
    loadingStarts.forEach(fn => fn())
  }
  apiRequests++
  return config
}

const analyticsRequest = function (config) {
  const url = config.url
  const qi = url.lastIndexOf('?')
  const method = config.method
  if (Vue.analytics) {
    const category = 'api-' + method
    const action = qi > -1 ? url.substr(0, qi) : url
    const label = qi > -1 ? url.substr(qi + 1) : null
    analytics[`${category}/${action}/${label}`] = [category, action, label]
    if (!isNaN(analyticsHandlerId)) {
      clearTimeout(analyticsHandlerId)
    }
    analyticsHandlerId = setTimeout(function () {
      _.forIn(analytics, function (value, key) {
        Vue.analytics.trackEvent.apply(Vue.analytics, value)
        delete analytics[key]
      })
    }, 1000)
  }
  return config
}

const loadingResponse = function (response) {
  setTimeout(() => {
    apiRequests--
    if (apiRequests == 0) {
      loadingStops.forEach(fn => fn())
    }
  }, 200)
  if (response instanceof Error) {
    return Promise.reject(response)
  }
  return response
}

const sessionMilliseconds = 1000 * 60 * 60

const authExpiredHandler = _.debounce(() => {
  const lastAccessed = store.getters['auth/lastAccessed']
  store.commit('route/lastAccessed', _.assign({}, Router.currentRoute))
  if (sessionMilliseconds + lastAccessed < Date.now()) {
    Notify.create({
      icon: 'warning',
      position: 'top-right',
      message: '인증이 만료 되었습니다',
      timeout: 3000,
      detail: '다시 로그인 하세요'
    })
    setTimeout(() => {
      signOut().then(() => {
        Router.push('/sign-in')
      })
    }, 2000)
  } else {
    init()
    Notify.create({
      icon: 'warning',
      position: 'top-right',
      message: '인증이 만료 되었습니다',
      timeout: 3000,
      detail: '다시 시도 하세요'
    })
  }


}, 500)

let statusHandlers = {
  '401': (error) => {
    let message = error.response.data.message.toLowerCase()
    if (message.indexOf('verify') > -1 && message.indexOf('token') > -1) {
      authExpiredHandler()
      return true
    }
  },
  '403': (error) => {
    // TODO: 인증여부에 따라 로그인 페이지로 이동?
    return
  }
}

const errorHandler = (error) => {
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

let errorResponse = (error) => {
  if (error.config && !error.config.preventDefault) {
    errorHandler(error)
  } else {
    error.resumePreventDefault = _.bind(errorHandler, null, error)
  }
  return Promise.reject(error)
}

const axiosApi = axios.create({
  baseURL: apiBaseUrl
})

let lastAccessedResponse = (response) => {
  store.commit('auth/lastAccessed', Date.now())
  return response
}

axiosApi.interceptors.request.use(configRequest)
axiosApi.interceptors.request.use(loadingRequest)
axiosApi.interceptors.request.use(analyticsRequest)

axiosApi.interceptors.response.use(loadingResponse, loadingResponse)
axiosApi.interceptors.response.use(lastAccessedResponse, errorResponse)

export default ({Vue}) => {
  Vue.prototype.$api = axiosApi
}

export { axiosApi as api }
