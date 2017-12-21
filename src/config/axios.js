import axios from 'axios';
import * as _ from 'lodash';
import {Loading} from 'quasar';
import {Alert} from 'quasar';

let loadFunction = (config) => {
  config.url = _.template(config.url)(config.data);
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
  Loading.hide();
  if (error.response) {
    let message = error.response.data.message;
    if (_.isArray(error.response.data.errors)) {
      message = error.response.data.errors.map(
          (e) => `${e.field} : ${e.defaultMessage}`).join('<br>');
    }
    let alert = Alert.create({
      icon: 'warning',
      position: 'bottom-right',
      html: `${message}`
    });
    setTimeout(alert.dismiss, 3000);
  }
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
