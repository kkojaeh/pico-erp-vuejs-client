import * as _ from 'lodash';
import qs from 'qs';
import Vue from 'vue';

export class FetchableModel {
  get axios() {
  }

  get url() {
  }

  constructor(data) {
    _.assign(this, data);
  }

  fetch(data) {
    const o = _.assign({}, this);
    if (data) {
      _.assign(o, data);
    }
    return new Promise((resolve, reject) => {
      this.axios.get(this.resolveUrl(this.url, o), {data: o}).then(
          (response) => {
            const parsed = this.parse(response);
            _.keys(parsed).forEach((key) => {
              Vue.set(this, key, parsed[key]);
            });
            resolve(this);
          }).catch((error) => {
        reject(error);
      });
    });
  }

  resolveUrl(url, data) {
    return url + (_.includes(url, '?') ? '&' : '?') + qs.stringify(data);
  }

  parse(response) {
    return response.data;
  }

  snapshot() {
    Object.defineProperty(this, '_snapshot', {
      value: _.assign({}, this)
    });
  }

  hasChanged(property) {
    if (property) {
      return !this.equals(this._snapshot[property], this[property]);
    }
    return !_.keys(this._snapshot).reduce(
        (acc, key) => acc && this.equals(this._snapshot[key], this[key]),
        true);
  }

  equals(a, b) {
    return _.isEqual(a, b);
  }
};
