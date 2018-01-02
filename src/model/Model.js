import * as _ from 'lodash';
import qs from 'qs';
import Vue from 'vue';
import validate from 'validate.js';

export class Model {

  constructor(data) {
    _.assign(this, data);
    _.defaults(this, this.defaults);
    this.$errors = {};
  }

  get defaults() {
    return {};
  }

  async $validate(constraints) {
    try {
      await validate.async(this, constraints, {fullMessages: false});
      this.$errors = {};
      return true;
    } catch (e) {
      console.log(e);
      debugger;
      _.keys(e).forEach((key) => {
        Vue.set(this.$errors, key, e[key].join('\n'));
      });
      return false;
    }
  }
}

export class FetchableModel extends Model{
  get axios() {
  }

  get url() {
  }

  async fetch(data) {
    const o = _.assign({}, this);
    if (data) {
      _.assign(o, data);
    }
    let result = await this.axios.get(this.resolveUrl(this.url, o), {data: o});
    const parsed = this.parse(result);
    _.keys(parsed).forEach((key) => {
      Vue.set(this, key, parsed[key]);
    });
    return this;
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

export async function exists(axios, url, data) {
  try {
    let result = await axios.get(url, {
      data: data,
      preventDefault: true
    });
    return result;
  } catch (e) {
    if (e.response.status == 404) {
      return false;
    } else {
      e.resumePreventDefault();
      throw e;
    }
  }
};
