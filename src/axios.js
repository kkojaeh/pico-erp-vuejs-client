import axios from 'axios'
import { Loading } from 'quasar'

let loadFunction = config => {
  Loading.show()
  return config
}
let finishFunction = response => {
  Loading.hide()
  return response
}
let errorFunction = error => {
  Loading.hide()
  return Promise.reject(error)
}

const axiosApi =
  axios.create({ baseURL: document.querySelector('meta[name=api-server-url]').content })

axiosApi.interceptors.request.use(loadFunction)
axiosApi.interceptors.response.use(finishFunction, errorFunction)

let clients = {
  $http: {
    get () {
      return {
        api: axiosApi
      }
    }
  }
}

export default (Vue) => {
  Object.defineProperties(Vue.prototype, clients)
}
