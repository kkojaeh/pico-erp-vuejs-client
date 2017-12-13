import axios from 'axios';
import {Loading} from 'quasar';

let loadFunction = (config) => {
  config.headers.common['X-Firebase-Auth'] = localStorage.getItem(
      'API_FIREBASE_TOKEN');
  Loading.show({
    delay: 100
  });
  return config;
};
let finishFunction = (response) => {
  setTimeout(() => Loading.hide(), 500);
  return response;
};
let errorFunction = (error) => {
  setTimeout(() => Loading.hide(), 500);
  return Promise.reject(error);
};

const axiosApi = axios.create(
    {baseURL: document.querySelector('meta[name=api-server-url]').content});

axiosApi.interceptors.request.use(loadFunction);
axiosApi.interceptors.response.use(finishFunction, errorFunction);

let clients = {
  $http: {
    get() {
      return {
        api: axiosApi
      };
    }
  }
};

export default (Vue) => {
  Object.defineProperties(Vue.prototype, clients);
};

export {axiosApi as api};
