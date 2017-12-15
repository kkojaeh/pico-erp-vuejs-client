import * as _ from 'lodash';
import qs from 'qs';

/* eslint-disable */
export class FetchableModel {
  axios = null;
  url = null;

  constructor(data) {
    _.assign(this, data);
  }

  fetch = (data) => {
    return new Promise((resolve, reject) => {
      this.axios.get(this.resolveUrl(this.url, data), {data: data}).then(
          (response) => {
            const parsed = this.parse(response);
            _.assign(this, parsed);
            resolve(this);
          }).catch((error) => {
        reject(error);
      });
    });
  };

  resolveUrl = (url, data) => {
    return _.template(url)(data) + (_.includes(url, '?') ? '&' : '?')
        + qs.stringify(data);
  };

  parse = (response) => {
    return response.data;
  };
};
/* eslint-enable */
